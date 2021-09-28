import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { Component } from "react";
import {
  Alert,
  Button,
  Card,
  Col,
  Form,
  Modal,
  Row,
  Tab,
  Tabs,
} from "react-bootstrap";
import { SCT_API_URL } from "../../../../Constantes";
import {
  to_dd_month_yyyy_hh_mm,
  to_range,
  to_yyyy_mm_dd_hh_mm_ss,
} from "../../common_functions";
import {
  leaf_component,
  consignacion,
  detalle_consignacion,
} from "../../types";
import { DateRange } from "react-date-range";
import { es } from "date-fns/locale";
import * as _ from "lodash";

export interface modal_props {
  object: leaf_component;
  handle_close?: Function;
  handle_edited_root_block?: Function;
  handle_message?: Function;
}
type Range = {
  startDate: Date;
  endDate: Date;
  key: string;
};

export interface modal_state {
  show: boolean;
  message: string;
  periods: Array<consignacion>;
  show_date: boolean;
  ini_date: Date;
  ini_date_str: string;
  end_date: Date;
  end_date_str: string;
  range: Array<Range>;
  detalle: detalle_consignacion;
  check_form: boolean;
  id_consignacion: string | undefined;
  editing: boolean;
  no_consignacion: string;
}

let modal_id = "Modal_add_consigment";

export class Modal_add_consignment extends Component<modal_props, modal_state> {
  responsable: string;
  constructor(props) {
    super(props);
    let range = {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    };
    this.state = {
      show: true,
      message: "",
      periods: [],
      show_date: false,
      ini_date: range.startDate,
      ini_date_str: to_yyyy_mm_dd_hh_mm_ss(range.startDate),
      end_date: range.endDate,
      end_date_str: to_yyyy_mm_dd_hh_mm_ss(range.endDate),
      range: [range],
      id_consignacion: undefined,
      detalle: {
        descripcion_corta: "",
        detalle: "",
        elemento: this.props.object
      },
      check_form: false,
      editing: false,
      no_consignacion: ""
    };
    this.responsable =
      localStorage.getItem("userRole") +
      " | " +
      localStorage.getItem("userDisplayName");
  }

  // Component functions:
  componentDidMount = () => {
    this._get_periods();
  };

  // HOOKS SECTION:
  handleClose = () => {
    // actualizo el estado local
    this.setState({ show: false });
    if (this.props.handle_close !== undefined) {
      // actualizo el estado del componente padre
      this.props.handle_close(modal_id, false);
    }
  };
  handleMessages = (message) => {
    if (this.props.handle_message !== undefined) {
      // actualizo el estado del componente padre
      this.props.handle_message(modal_id, message);
    }
  };
  handleShow = () => {
    this.setState({ show: true });
  };
  handleEditedRootComponent = (bloqueroot) => {
    if (this.props.handle_edited_root_block !== undefined) {
      // permite enviar el bloque root editado:
      this.props.handle_edited_root_block(bloqueroot);
    }
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

  _get_range = () => {
    let ini_period_str = localStorage.getItem("$ini_period");
    let end_period_str = localStorage.getItem("$end_period");
    let ini_period = new Date();
    if (ini_period_str !== null) {
      ini_period = new Date(ini_period_str);
    }
    let end_period = new Date();
    if (end_period_str !== null) {
      end_period = new Date(end_period_str);
    }
    return { ini_period: ini_period, end_period: end_period };
  };

  _get_periods = (keep_msg = true) => {
    let range = this._get_range();
    let path = `${SCT_API_URL}/component-leaf/comp-leaf/${this.props.object.public_id}/consignaciones/${to_range(
      range.ini_period,
      range.end_period
    )}`;
    fetch(path, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((json) => {
        if (keep_msg) {
          this.setState({ message: json.msg });
        }
        if (json.success) {
          // crear lista de consignaciones.
          let consignaciones = json.consignaciones;
          let periods = [] as Array<consignacion>;
          for (const consignacion of consignaciones) {
            let period = {
              fecha_inicio: new Date(consignacion.fecha_inicio),
              fecha_final: new Date(consignacion.fecha_final),
              id_consignacion: consignacion.id_consignacion,
              detalle: consignacion.detalle,
              responsable: consignacion.responsable,
              no_consignacion: consignacion.no_consignacion,
              editado: false,
            } as consignacion;
            periods.push(period);
          }
          periods.sort((a, b) =>
            a.fecha_inicio > b.fecha_inicio
              ? 1
              : b.fecha_inicio > a.fecha_inicio
              ? -1
              : 0
          );
          this.setState({ periods: periods });
        }
      })
      .catch((error) => {
        console.log(error);
        let msg = `Ha fallado la conexión con la API de modelamiento (api-sct). \n ${error}`;
        this.setState({ message: msg });
        this.handleMessages(msg);
      });
  };

  _post_period = async (period: consignacion) => {
    let path = `${SCT_API_URL}/component-leaf/comp-leaf/${this.props.object.public_id}/consignaciones/${to_range(
      period.fecha_inicio,
      period.fecha_final
    )}`;
    let resp = "";

    await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        detalle: period.detalle,
        responsable: period.responsable,
        no_consignacion: period.no_consignacion
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        this.setState({ message: json.msg });
        resp = json.msg;
      })
      .catch((error) => {
        console.log(error);
        let msg = "Ha fallado la conexión con la API de modelamiento (api-sct)";
        this.setState({ message: msg });
        this.handleMessages(msg);
      });
    return resp;
  };

  _put_period = async (period: consignacion) => {
    let path = `${SCT_API_URL}/component-leaf/comp-leaf/${this.props.object.public_id}/consignaciones/${to_range(
      period.fecha_inicio,
      period.fecha_final
    )}`;
    let resp = "";

    await fetch(path, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        detalle: period.detalle,
        responsable: period.responsable,
        id_consignacion: period.id_consignacion,
        no_consignacion: period.no_consignacion
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        this.setState({ message: json.msg });
        resp = json.msg;
      })
      .catch((error) => {
        console.log(error);
        let msg = "Ha fallado la conexión con la API de modelamiento (api-sct)";
        this.setState({ message: msg });
        this.handleMessages(msg);
      });
    return resp;
  };

  _delete_period = async (period: consignacion) => {
    let path = `${SCT_API_URL}/component-leaf/comp-leaf/${this.props.object.public_id}/consignacion/${period.id_consignacion}`;
    let resp = "";

    await fetch(path, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((json) => {
        this.setState({ message: json.msg });
        resp = json.msg;
      })
      .catch((error) => {
        console.log(error);
        let msg = "Ha fallado la conexión con la API de modelamiento (api-sct)";
        this.setState({ message: msg });
        this.handleMessages(msg);
      });
    return resp;
  };

  // Permite ingresar periodos de consignaciones si fuera necesario
  _onclick_consignaciones = async () => {
    let result = "";
    for (const period of this.state.periods) {
      let new_period = period.id_consignacion.includes("period_");
      if (new_period) {
        result += "\n" + (await this._post_period(period));
      } else if (period.editado) {
        result += "\n" + (await this._put_period(period));
      }
    }
    this.setState({ message: result });
    this._get_periods(false);
  };

  _add_or_edit_period = () => {
    if (!this._check_form()) {
      return;
    }
    let periods = this.state.periods;
    let period = {
      id_consignacion: _.uniqueId("period_"),
      fecha_inicio: _.cloneDeep(this.state.ini_date),
      fecha_final: _.cloneDeep(this.state.end_date),
      detalle: _.cloneDeep(this.state.detalle),
      responsable: this.responsable,
      no_consignacion:  _.cloneDeep(this.state.no_consignacion),
      editado: true,
    } as consignacion;

    // añadir periodo: // no existe id público todavía por lo que tiene un nuevo id
    if (!this.state.editing) {
      periods.push(period);
    }
    // editar periodo: // utiliza el mismo Id a editar
    else {
      let idx = this._search_this_period_by_id(this.state.id_consignacion);
      if (idx < 0) {
        return;
      }
      period.editado = true;
      period.id_consignacion = _.cloneDeep(this.state.id_consignacion);
      periods[idx] = _.cloneDeep(period);
    }
    periods.sort((a, b) =>
      a.fecha_inicio > b.fecha_inicio
        ? 1
        : b.fecha_inicio > a.fecha_inicio
        ? -1
        : 0
    );
    this.setState({ periods: periods, editing: false, id_consignacion: undefined });
  };

  _search_this_period_by_id = (id_consignacion) => {
    let idx = -1;
    for (const period of this.state.periods) {
      idx += 1;
      if (period.id_consignacion === id_consignacion) {
        break;
      }
    }
    return idx;
  };

  _remove_period = async (period: consignacion) => {
    let isNew = period.id_consignacion.includes("period_");
    // si ya existe en base de datos:
    if (!isNew) {
      if (window.confirm("Desea eliminar este registro de la base de datos?")) {
        let resp = await this._delete_period(period);
        this.setState({ message: resp });
      } else {
        return;
      }
    }
    let new_periods = [];
    for (const _period of this.state.periods) {
      if (period.id_consignacion !== _period.id_consignacion) {
        new_periods.push(_period);
      }
    }
    this.setState({ periods: new_periods });
  };

  _edit_period = (period: consignacion) => {
    this._set_period(period, true);
  };

  _set_period = (period: consignacion, editing: boolean) => {
    let detalle = this.state.detalle;
    let range = this.state.range[0];
    detalle.descripcion_corta = period.detalle.descripcion_corta;
    detalle.detalle = period.detalle.detalle;
    range.startDate = period.fecha_inicio;
    range.endDate = period.fecha_final;

    this.setState({
      editing: editing,
      detalle: detalle,
      ini_date_str: to_yyyy_mm_dd_hh_mm_ss(period.fecha_inicio),
      ini_date: period.fecha_inicio,
      end_date_str: to_yyyy_mm_dd_hh_mm_ss(period.fecha_final),
      end_date: period.fecha_final,
      id_consignacion: _.cloneDeep(period.id_consignacion),
      range: [range],
      no_consignacion: _.cloneDeep(period.no_consignacion)
    });
  };

  _show_periods_to_insert = () => {
    let periods = [];
    let id = 0;
    for (const period of this.state.periods) {
      let period_container = (
        <div
          key={"per_" + id}
          className={
            period.id_consignacion === this.state.id_consignacion
              ? "period-edited"
              : "period-item"
          }
        >
          <div
            className="period-label"
            onClick={(e) => this._set_period(period, false)}
          >
            <div>{to_dd_month_yyyy_hh_mm(period.fecha_inicio)}</div>
            <div>{to_dd_month_yyyy_hh_mm(period.fecha_final)}</div>
          </div>
          <div className="period-button">
            <div
              className="period-edit"
              onClick={(e) => this._edit_period(period)}
            >
              <FontAwesomeIcon icon={faPen} />
            </div>
            <div
              className="period-delete"
              onClick={(e) => this._remove_period(period)}
            >
              <FontAwesomeIcon icon={faTrash} />
            </div>
          </div>
        </div>
      );
      id += 1;
      periods.push(period_container);
    }
    return periods;
  };

  _forma_periodo = () => {
    return (
      <Card className="container-tab-menu">
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
      </Card>
    );
  };

  _check_form = () => {
    let fields = ["descripcion_corta", "detalle"];
    let valid = true;
    let size_field = 10;
    let message = "";
    for (const field of fields) {
      if (
        this.state.detalle[field] !== undefined &&
        this.state.detalle[field].length >= size_field
      ) {
        valid = valid && true;
      } else {
        valid = valid && false;
        message = `El campo ${field} debe ser mayor a ${size_field} caracteres`;
        break;
      }
    }
    if (this.state.ini_date >= this.state.end_date) {
      message = "Las fechas seleccionadas no son válidas";
      valid = false;
    }
    for (const period of this.state.periods) {
      // si se está editando un periodo, entonces se debe esquivar
      // la revisión de fechas contra este periodo:
      if (this.state.id_consignacion === period.id_consignacion) {
        continue;
      }
      // Caso contrario, se debe revisar que no exista superposición de fechas
      if (
        period.fecha_inicio <= this.state.ini_date &&
        this.state.ini_date <= period.fecha_final
      ) {
        message = `La fecha de inicio (${to_dd_month_yyyy_hh_mm(
          this.state.ini_date
        )}) 
        está contenida dentro del periodo:
        [${to_dd_month_yyyy_hh_mm(
          period.fecha_inicio
        )},${to_dd_month_yyyy_hh_mm(period.fecha_final)}]`;
        valid = false;
        break;
      }
      if (
        period.fecha_inicio <= this.state.end_date &&
        this.state.end_date <= period.fecha_final
      ) {
        message = `La fecha de fin (${to_dd_month_yyyy_hh_mm(
          this.state.end_date
        )}) 
        está contenida dentro del periodo:
        [${to_dd_month_yyyy_hh_mm(
          period.fecha_inicio
        )},${to_dd_month_yyyy_hh_mm(period.fecha_final)}]`;
        valid = false;
        break;
      }
      if (
        this.state.ini_date <= period.fecha_inicio &&
        period.fecha_final <= this.state.end_date
      ) {
        message = `La fecha de inicio y fin (${to_dd_month_yyyy_hh_mm(
          this.state.ini_date
        )}, ${to_dd_month_yyyy_hh_mm(this.state.end_date)}) 
        contenienen al periodo:
        [${to_dd_month_yyyy_hh_mm(
          period.fecha_inicio
        )},${to_dd_month_yyyy_hh_mm(period.fecha_final)}]`;
        valid = false;
        break;
      }
    }
    // TODO: Restablecer
    this.setState({ check_form: true, message: message });
    return valid;
  };

  _on_change_field = (field: string, value: string) => {
    let detalle = this.state.detalle;
    detalle[field] = value;
    this.setState({ detalle: detalle });
    this._check_form();
  };

  _forma_detalle = () => {
    return (
      <Card className="container-tab-menu">
        <Row className="mb-3">
          <Form.Group as={Col}  lg={3}>
            <Form.Label >
              <span style={{ color: "red" }}>* </span>
              No. Consignación
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Referencia"
              value={this.state.no_consignacion}
              onChange={(e) => { this.setState({no_consignacion: e.target.value}) }
              }
            />

          </Form.Group>
          <Form.Group as={Col}>
            <Form.Label>
              <span style={{ color: "red" }}>* </span>
              Descripción corta de la consignación
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Frase descriptiva del evento"
              value={this.state.detalle.descripcion_corta}
              onChange={(e) =>
                this._on_change_field("descripcion_corta", e.target.value)
              }
            />
          </Form.Group>
        </Row>
        <Form.Group>
          <Form.Label>
            <span style={{ color: "red" }}>* </span>
            Detalle de la consignación
          </Form.Label>
          <Form.Control
            as="textarea"
            row={4}
            value={this.state.detalle.detalle}
            onChange={(e) => this._on_change_field("detalle", e.target.value)}
          />
        </Form.Group>
      </Card>
    );
  };

  _to_lines = (msg: string) => {
    return msg.split("\n").map((str) => <p>{str}</p>);
  };

  render() {
    return (
      <>
        <Modal
          show={this.state.show}
          onHide={this.handleClose}
          animation={false}
          size="lg"
        >
          <Modal.Header translate={"true"} closeButton>
            <Modal.Title>
              Ingreso de consignaciones en {this.props.object.name}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="BlockName">
                <Form.Text>
                  Esta forma permite ingresar datos de consignaciones de manera
                  manual
                </Form.Text>
                <br></br>

                <Tabs
                  defaultActiveKey="period"
                  id="tab_form"
                  className="mb-3"
                  transition={false}
                >
                  <Tab eventKey="period" title="Fijar periodo">
                    {this._forma_periodo()}
                  </Tab>
                  <Tab eventKey="detalle" title="Detalles">
                    {this._forma_detalle()}
                  </Tab>
                </Tabs>
                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="formPlaintextPassword"
                >
                  <Form.Label column sm="2">
                    Responsable:
                  </Form.Label>
                  <Col sm="10">
                    <Form.Control
                      plaintext
                      readOnly
                      defaultValue={this.responsable}
                    />
                  </Col>
                </Form.Group>
                <br></br>
                <Button
                  variant="success"
                  onClick={this._add_or_edit_period}
                  className="add-period"
                >
                  {this.state.editing ? "Editar " : "Agregar "}
                  periodo
                </Button>

                <br></br>

                <Form.Label>Periodos de consignaciones a ingresar:</Form.Label>
                <Form.Row className="period-list">
                  {this._show_periods_to_insert()}
                </Form.Row>
                <Form.Label><span style={{color:"red"}}>No olvide enviar estos periodos al servidor</span></Form.Label>
              </Form.Group>
              {this.state.message.length === 0 ? (
                <></>
              ) : (
                <Alert variant="info" style={{ padding: "7px" }}>
                  {this._to_lines(this.state.message)}
                </Alert>
              )}
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleClose}>
              Cerrar
            </Button>
            <Button
              variant="outline-danger"
              onClick={this._onclick_consignaciones}
            >
              Ingresar periodos de consignaciones para {this.props.object.name}
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

export const modal_consignaciones_block_function = (
  object: leaf_component,
  handle_close: Function,
  handle_changes_in_root: Function
) => {
  return (
    <Modal_add_consignment
      object={object}
      handle_close={handle_close}
      handle_edited_root_block={handle_changes_in_root}
    />
  );
};
