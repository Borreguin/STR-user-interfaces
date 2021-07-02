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
import { block } from "../types";

export interface props {
  handle_msg?: Function;
  handle_isValid?: Function;
  component: block;
}

export type Range = {
  startDate: Date;
  endDate: Date;
  key: string;
};

type parameters = {
  root_id: string;
  leaf_id: string;
  fecha_inicio: string;
  fecha_final: string;
};

export interface state {
  show_date: boolean;
  ini_date: Date;
  ini_date_str: string;
  end_date: Date;
  end_date_str: string;
  range: Array<Range>;
  log: Object;
}

export class DesdeSubComponente extends Component<props, state> {
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
      log: { msg: "Aún no se ha ejecutado la prueba" },
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
    console.log("component", this.props.component);
  };

  _create_root_component = async () => {
    let path = `${SCT_API_URL}/component-leaf/comp-root/${this.props.component.parent_id}/comp-leaf/${this.props.component.public_id}/add-root-component`;
    
    let isValid = false;
    await fetch(path, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
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

  render() {
    return (
      <>
        <Form.Group>
          <Form.Label>
            Esta opción permite modelar subcomponentes internos, lo que permite
            indicar a detalle la topología interna de este componente. Cada
            subcomponente interno tendrá la posibilidad de elegir un nuevo tipo
            de fuente asociado.
          </Form.Label>
          <Form.Label>
            <span style={{ color: "red" }}>Nota:</span> La creación de un
            subcomponente interno eliminará la fuente anteriormente configurada.
          </Form.Label>
          
          <Form.Row style={{ marginTop: "17px", justifyContent: "end", marginRight: "10px"} }>
            <Button
              variant="outline-danger"
              className="test-manual-btn"
              onClick={this._create_root_component}
            >
              Crear subcomponente
            </Button>
          </Form.Row>
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
