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
  to_yyyy_mm_dd_hh_mm_ss,
} from "../../common_functions";
import {
  detalle_indisponibilidad,
  leaf_component,
  unavailability,
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
  periods: Array<unavailability>;
  show_date: boolean;
  ini_date: Date;
  ini_date_str: string;
  end_date: Date;
  end_date_str: string;
  range: Array<Range>;
  detalle: detalle_indisponibilidad;
  check_form: boolean;
  public_id: string | undefined;
}

let modal_id = "Modal_indisponibilidad_componente";

export class Modal_indisponibilidad_component extends Component<
  modal_props,
  modal_state
> {
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
      public_id: undefined,
      detalle: {
        descripcion_corta: "",
        detalle: "",
      },
      check_form: false,
    };
  }
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

  // INTERNAL FUNCTIONS:
  // Elimina un bloque interno de un bloque root
  _onclick_indisponibilidad = () => {
    console.log(this.props.object);
    let path = `${SCT_API_URL}/todo/${this.props.object.parent_id}/comp-leaf/${this.props.object.public_id}`;
    this.setState({ message: "Eliminando bloque interno" });
    // Creando el nuevo root block mediante la API
    fetch(path, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((json) => {
        console.log("modal_indisponibilidad_componente", json);
        if (json.success) {
          this.handleEditedRootComponent(json);
          // this.handleClose();
        } else {
          this.setState({ message: json.msg });
          this.handleMessages(json.msg);
        }
      })
      .catch((error) => {
        console.log(error);
        let msg = "Ha fallado la conexión con la API de modelamiento (api-sct)";
        this.setState({ message: msg });
        this.handleMessages(msg);
      });
  };

  _add_or_edit_period = () => {
    if (!this._check_form()) {
      return;
    }
    let periods = this.state.periods;
    let period = {
      public_id: _.uniqueId("period_"),
      fecha_inicio: _.cloneDeep(this.state.ini_date),
      fecha_final: _.cloneDeep(this.state.end_date),
      detalle: _.cloneDeep(this.state.detalle),
      responsable: "test",
    } as unavailability;

     // añadir periodo: // no existe id público todavía
    if (!this.state.public_id) {
      periods.push(period);
    }
     // editar periodo:
    else {
      let idx = this._search_this_period_by_id(this.state.public_id);
      if (idx < 0) { return }
      periods[idx] = period;
      this.setState({ public_id: undefined });
    }
    this.setState({ periods: periods });
  };

  _search_this_period_by_id = (public_id) => {
    let idx = -1;
    for (const period of this.state.periods) {
      idx += 1;
      if (period.public_id === public_id) {
        break;
      }
    }
    return idx;
  }

  _remove_period = (period: unavailability) => {
    let new_periods = [];
    for (const _period of this.state.periods) {
      if (period.public_id !== _period.public_id) {
        new_periods.push(_period);
      }
    }
    this.setState({ periods: new_periods });
  };

  _edit_period = (period: unavailability) => {
    let detalle = this.state.detalle;
    let range = this.state.range[0];
    detalle.descripcion_corta = period.detalle.descripcion_corta;
    detalle.detalle = period.detalle.detalle;
    range.startDate = period.fecha_inicio;
    range.endDate = period.fecha_final;

    this.setState({
      detalle: detalle,
      ini_date_str: to_yyyy_mm_dd_hh_mm_ss(period.fecha_inicio),
      ini_date:period.fecha_inicio,
      end_date_str: to_yyyy_mm_dd_hh_mm_ss(period.fecha_final),
      end_date:period.fecha_final,
      public_id: period.public_id,
      range: [range]
    });
  };

  _show_periods_to_insert = () => {
    let periods = [];
    let id = 0;
    for (const period of this.state.periods) {
      let period_container = (
        <div key={"per_" + id} className={period.public_id === this.state.public_id? "period-edited": "period-item"} >
          <div className="period-label">
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
      if (this.state.public_id === period.public_id) { continue; }
      // Caso contrario, se debe revisar que no exista superposición de fechas
      if (period.fecha_inicio <= this.state.ini_date && this.state.ini_date <= period.fecha_final) {
        message = `La fecha de inicio (${to_dd_month_yyyy_hh_mm(this.state.ini_date)}) 
        está contenida dentro del periodo:
        [${to_dd_month_yyyy_hh_mm(period.fecha_inicio)},${to_dd_month_yyyy_hh_mm(period.fecha_final)}]`;
        valid = false;
        break;
      }
      if (period.fecha_inicio <= this.state.end_date && this.state.end_date <= period.fecha_final) {
        message = `La fecha de fin (${to_dd_month_yyyy_hh_mm(this.state.end_date)}) 
        está contenida dentro del periodo:
        [${to_dd_month_yyyy_hh_mm(period.fecha_inicio)},${to_dd_month_yyyy_hh_mm(period.fecha_final)}]`;
        valid = false;
        break;
      }
      if (this.state.ini_date <= period.fecha_inicio && period.fecha_final <= this.state.end_date) {
        message = `La fecha de inicio y fin (${to_dd_month_yyyy_hh_mm(this.state.ini_date)}, ${to_dd_month_yyyy_hh_mm(this.state.end_date)}) 
        contenienen al periodo:
        [${to_dd_month_yyyy_hh_mm(period.fecha_inicio)},${to_dd_month_yyyy_hh_mm(period.fecha_final)}]`;
        valid = false;
        break;
      }
    }
    // TODO: Restablecer
    this.setState({ check_form: valid, message: message });
    console.log("check_form", valid, message);
    return valid;
  };

  _on_change_field = (field: string, value: string) => {
    let detalle = this.state.detalle;
    detalle[field] = value;
    this.setState({ detalle: detalle });
    this._check_form();
  };

  _forma_detalle = () => {
    console.log("forma_detalle", this.state.detalle);
    return (
      <Card className="container-tab-menu">
        <Form.Group>
          <Form.Label>
            <span style={{ color: "red" }}>* </span>
            Descripción corta de la indisponibilidad
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
        <Form.Group>
          <Form.Label>
            <span style={{ color: "red" }}>* </span>
            Detalle de la indisponibilidad
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
              Ingreso de indisponibilidad en {this.props.object.name}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="BlockName">
                <Form.Text>
                  Esta forma permite ingresar datos de indisponibilidad de
                  manera manual
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
                      defaultValue={"valor a actualizar"}
                    />
                  </Col>
                </Form.Group>
                <br></br>
                <Button
                  variant="warning"
                  onClick={this._add_or_edit_period}
                  className="add-period"
                >
                  {!this.state.public_id? "Agregar " : "Editar "}
                  periodo
                </Button>

                <br></br>

                <Form.Label>
                  Periodos de indisponibilidad a ingresar:
                </Form.Label>
                <Form.Row className="period-list">
                  {this._show_periods_to_insert()}
                </Form.Row>
              </Form.Group>
              {this.state.message.length === 0 ? (
                <></>
              ) : (
                <Alert variant="info" style={{ padding: "7px" }}>
                  {this.state.message}
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
              onClick={this._onclick_indisponibilidad}
            >
              Ingresar periodos de indisponibilidad para{" "}
              {this.props.object.name}
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

export const modal_indisponibilidad_block_function = (
  object: leaf_component,
  handle_close: Function,
  handle_changes_in_root: Function
) => {
  return (
    <Modal_indisponibilidad_component
      object={object}
      handle_close={handle_close}
      handle_edited_root_block={handle_changes_in_root}
    />
  );
};
