import { DateRange } from "react-date-range";
import { es } from "date-fns/locale";
import React, { Component, useState } from "react";
import { Button, Form } from "react-bootstrap";
import "./Sources.css";
import ReactJson from "react-json-view";
import {
  get_last_month_dates,
  to_yyyy_mm_dd_hh_mm_ss,
} from "../common_functions";
import { SCT_API_URL } from "../../../Constantes";
import { leaf_component } from "../types";

export interface props {
  handle_msg?: Function;
  handle_isValid?: Function;
  handle_sources_changes: Function;
  component: leaf_component;
}

export type Range = {
  startDate: Date;
  endDate: Date;
  key: string;
};

type parameters = {
  fecha_inicio: string;
  fecha_final: string;
  piserver_name: string;
  tag_name: string;
  condicion_filtrado: string;
};

export interface state {
  show_date: boolean;
  ini_date: Date;
  ini_date_str: string;
  end_date: Date;
  end_date_str: string;
  range: Array<Range>;
  log: Object;
  pi_server: string;
  options: Array<JSX.Element>;
  tag_name: string;
  condition: string;
}

export class Historico extends Component<props, state> {
  constructor(props) {
    super(props);
    let r = get_last_month_dates();
    let range = {
      startDate: r.first_day_month,
      endDate: r.last_day_month,
      key: "selection",
    };
    this.state = {
      show_date: false,
      ini_date: r.first_day_month,
      ini_date_str: to_yyyy_mm_dd_hh_mm_ss(r.first_day_month),
      end_date: r.last_day_month,
      end_date_str: to_yyyy_mm_dd_hh_mm_ss(r.last_day_month),
      range: [range],
      log: { fuentes: this.props.component.sources },
      pi_server: "",
      options: [],
      tag_name: "UTR_C_GENERO_DNP.SV",
      condition: "INDISPONIBLE"
    };
  }

  _handle_message = (msg) => {
    if (this.props.handle_msg !== undefined) {
      this.props.handle_msg(msg);
    }
  };
  _handle_isValid = (isvalid: boolean) => {
    if (this.props.handle_isValid !== undefined) {
      this.props.handle_isValid(isvalid);
    }
  };

  componentDidMount = () => {
    let path = `${SCT_API_URL}/options/pi-servers`;
    fetch(path)
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          // creando lista de opciones
          let options = this.state.options;
          let ix = 0;
          for (const pi_server of json.pi_servers) {
            if (pi_server !== null) {
              if (ix === 0) {
                this.setState({ pi_server: pi_server });
              }
              options.push(<option key={ix}>{pi_server}</option>);
              ix += 1;
            }
          }
          this.setState({ options: options });
        } else {
          this._handle_message({ succes: false, msg: json.msg });
        }
      })
      .catch((error) =>
        this._handle_message({ success: false, error: "" + error })
      );
  };

  _test_source = async () => {
    let path = `${SCT_API_URL}/source/historico/test`;
    let parameters = {
      fecha_inicio: to_yyyy_mm_dd_hh_mm_ss(this.state.ini_date),
      fecha_final: to_yyyy_mm_dd_hh_mm_ss(this.state.end_date),
      piserver_name: this.state.pi_server,
      tag_name: this.state.tag_name,
      condicion_filtrado: this.state.condition
    } as parameters;
    let isValid = false;
    await fetch(path, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(parameters),
    })
      .then((resp) => resp.json())
      .then((json) => {
        this.setState({ log: json });
        isValid = true;
      })
      .catch((error) => {
        console.log(error);
        let log = {
          msg: "Error al conectarse con la API (api-sct)",
        };
        isValid = false;
        this.setState({ log: log });
      });
    this._handle_isValid(isValid);
  };

  _config_source = async () => {
    let path = `${SCT_API_URL}/component-leaf/comp-root/${this.props.component.parent_id}/comp-leaf/${this.props.component.public_id}/configure-source`;
    let parameters = {
      fecha_inicio: to_yyyy_mm_dd_hh_mm_ss(this.state.ini_date),
      fecha_final: to_yyyy_mm_dd_hh_mm_ss(this.state.end_date),
      piserver_name: this.state.pi_server,
      tag_name: this.state.tag_name,
      condicion_filtrado: this.state.condition
    } as parameters;
    let isValid = false;
    await fetch(path, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ type: "HISTORICO", parameters: parameters }),
    })
      .then((resp) => resp.json())
      .then((json) => {
        this.setState({ log: json });
        this.props.handle_sources_changes(json);
        isValid = true;
      })
      .catch((error) => {
        console.log(error);
        let log = {
          msg: "Error al conectarse con la API (api-sct)",
        };
        isValid = false;
        this.setState({ log: log });
      });
    this._handle_isValid(isValid);
  };

  handleSelect = (range) => {
    this.setState({
      range: [range.selection],
      ini_date: range.selection.startDate,
      ini_date_str: to_yyyy_mm_dd_hh_mm_ss(range.selection.startDate),
      end_date: range.selection.endDate,
      end_date_str: to_yyyy_mm_dd_hh_mm_ss(range.selection.endDate),
    });
  };

  onChangeDate = (e, id) => {
    let dt = Date.parse(e.target.value);
    let isIniDate = id === "ini_date";
    let isEndDate = id === "end_date";
    if (!isNaN(dt)) {
      if (isIniDate) {
        this.setState({ ini_date: new Date(dt) });
      }
      if (isEndDate) {
        this.setState({ end_date: new Date(dt) });
      }
    }
    if (isIniDate) {
      this.setState({ ini_date_str: e.target.value });
    }
    if (isEndDate) {
      this.setState({ end_date_str: e.target.value });
    }
  };

  _handle_selection = (e) => {
    this.setState({ pi_server: e.target.value });
  };


  render() {
    return (
      <>
        <Form.Group>
          <Form.Label>Nombre del servidor a conectar:</Form.Label>
          <Form.Control as="select" onChange={this._handle_selection}>
            {this.state.options}
          </Form.Control>
          <br />
          <Form.Label>Nombre de la tag:</Form.Label>
          <Form.Control
            type="text"
            placeholder="Campo a utilizar"
            onChange={(e) => { this.setState({tag_name: e.target.value})}}
            value={this.state.tag_name}
          />
          <br />
          <Form.Label>Condición de indisponibilidad a utilizar:</Form.Label>
          <Form.Control
            type="text"
            placeholder="Campo a utilizar"
            onChange={(e) => { this.setState({condition: e.target.value})}}
            value={this.state.condition}
          />
          <br />
          <Form.Label>
            <div className="date-container">
              <Button
                variant="outline-dark"
                className="btn-date-fixed"
                onClick={() => {
                  this.setState({ show_date: !this.state.show_date });
                }}
              >
                {!this.state.show_date ? "Seleccionar" : "Aceptar"}
              </Button>
              <input
                className="date-input"
                value={this.state.ini_date_str}
                onChange={(e) => this.onChangeDate(e, "ini_date")}
              />{" "}
              <input
                className="date-input"
                value={this.state.end_date_str}
                onChange={(e) => this.onChangeDate(e, "end_date")}
              />
              <Button
                variant="outline-info"
                className="test-manual-btn"
                onClick={this._test_source}
              >
                Probar
              </Button>
              <Button
                variant="warning"
                className="test-manual-btn"
                onClick={this._config_source}
              >
                Guardar configuración
              </Button>
            </div>
          </Form.Label>

          <div
            className={
              this.state.show_date ? "date-range-show" : "date-range-no-show"
            }
          >
            <DateRange
              locale={es}
              ranges={this.state.range}
              showMonthAndYearPickers={true}
              dateDisplayFormat={"yyyy MMM d"}
              onChange={this.handleSelect}
              months={1}
              direction="horizontal"
              fixedHeight={true}
              column="true"
            />
          </div>
        </Form.Group>
        <Form.Group>
          <ReactJson
            name="log"
            displayObjectSize={true}
            collapsed={true}
            iconStyle="circle"
            displayDataTypes={false}
            theme="monokai"
            src={this.state.log}
          />
        </Form.Group>
      </>
    );
  }
}
