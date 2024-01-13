import React, { Component } from "react";
import {
  Form,
  Col,
  Card,
  Row,
  Button,
  CardGroup,
  Alert,
  Modal,
} from "react-bootstrap";
import { SRM_API_URL } from "../../../Constantes";
import { to_yyyy_mm_dd_hh_mm_ss } from "../../Common/DatePicker/DateRange";
import { DateRangeTime } from "../../Common/DatePicker/DateRangeTime";
import FilterSTRNodes from "../../Common/FilterNodes/FilterSTRNodes";

// Datos de selección
export type Forma = {
  fecha_inicio: Date;
  fecha_final: Date;
  selected: Object | undefined;
  selected_id: Object | undefined;
  detalle: string;
  descripcion_corta: string;
};

export type detalle = {
  detalle: string;
  descripcion_corta: string;
};

// consignaciones
export type Consignacion = {
  fecha_inicio: string;
  fecha_final: string;
  no_consignacion: string;
  id_consignacion: string;
  detalle: detalle;
  responsable: string;
};

export interface SRConsigProps {
  onChange: Function;
}

export interface SRConsigState {
  forma: Forma;
  msg: string;
  success: boolean;
  consignaciones: Array<Consignacion>;
  loading: boolean;
  show: boolean;
  consignacion_to_edit: Consignacion | undefined;
  ini_date: Date;
  end_date: Date;
  responsable: string;
}

class DatosConsultar extends Component<SRConsigProps, SRConsigState> {
  constructor(props) {
    super(props);
    this.state = {
      forma: {
        selected: undefined,
        selected_id: undefined,
        fecha_inicio: new Date(),
        fecha_final: new Date(),
        detalle: "",
        descripcion_corta: "",
      },
      msg: "",
      success: false,
      consignaciones: [],
      loading: false,
      show: false,
      consignacion_to_edit: undefined,
      ini_date: new Date(),
      end_date: new Date(),
      responsable:
        localStorage.getItem("userRole") +
        " | " +
        localStorage.getItem("userDisplayName"),
    };
  }

  // permite manejar cambios en el filtrado de nodos
  _handle_filter_STRNodes = (selected, selected_id) => {
    let forma = this.state.forma;
    forma["selected"] = selected;
    forma["selected_id"] = selected_id;
    this.setState({ forma: forma });
  };

  // permite manejar los cambios ocurridos en los hijos:
  // selector de fecha
  _handle_picker_change = (ini_date, end_date) => {
    let forma = this.state.forma;
    forma["fecha_inicio"] = ini_date;
    forma["fecha_final"] = end_date;
    this.setState({ forma: forma });
  };

  // seleccionar fecha para la consulta
  _handle_picker_change_to_consult = (ini_date, end_date) => {
    this.setState({ ini_date: ini_date, end_date: end_date });
  };

  // actualiza cambios de la forma
  _handle_form_changes = (e, field) => {
    let forma = this.state.forma;
    forma[field] = e.target.value;
    this.setState({ forma: forma });
  };

  // consulta las consignaciones en el periodo deseado:
  _consulta_consignaciones = (silent = false) => {
    let path =
      SRM_API_URL +
      "/admin-consignacion/consignacion/" +
      this.state.forma.selected_id["utr"] +
      "/" +
      to_yyyy_mm_dd_hh_mm_ss(this.state.ini_date) +
      "/" +
      to_yyyy_mm_dd_hh_mm_ss(this.state.end_date);

    if (!silent) {
      this.setState({ msg: "Buscando, espere por favor..." });
    }

    this.setState({
      success: false,
      consignaciones: [],
      loading: true,
    });

    fetch(path)
      .then((res) => res.json())
      .then((report) => {
        if (!silent) {
          this.setState({ msg: report.msg ? report.msg : "No definido" });
        }
        this.setState({
          success: report.success,
          loading: false,
        });
        if (report.success) {
          this.setState({ consignaciones: report.consignaciones });
        } else {
          this.setState({ consignaciones: [] });
        }
      })
      .catch(console.log);
  };

  // eliminar consignación:
  _delete_consignacion = (id_elemento, consignacion: Consignacion) => {
    let path =
      SRM_API_URL +
      "/admin-consignacion/consignacion/" +
      id_elemento +
      "/" +
      consignacion.id_consignacion;

    const confirm = window.confirm(
      "Seguro que desea eliminar la consignación?: \n\n" +
        consignacion.no_consignacion +
        "\n" +
        consignacion.fecha_inicio +
        "\n" +
        consignacion.fecha_final,
    );
    if (!confirm) return;
    this.setState({
      success: false,
      msg: "Procesando...",
      loading: true,
    });
    fetch(path, { method: "DELETE" })
      .then((res) => res.json())
      .then((report) => {
        this.setState({
          success: report.success,
          msg: report.msg,
          loading: false,
        });
        if (report.success) {
          this._consulta_consignaciones();
        }
      })
      .catch(console.log);
  };

  // desplegar consignaciones
  _render_consignaciones = () => {
    let consignaciones = [];
    if (this.state.consignaciones.length === 0) {
      return;
    }
    this.state.consignaciones.forEach((consignacion, ix) => {
      consignaciones.push(
        <Card.Header key={ix} className="consignacion_block">
          <div className="consignacion-title">
            <b>{consignacion.no_consignacion}</b>
          </div>
          <div className="consg_descrip">
            <div className="consignacion_label">
              {consignacion.fecha_inicio}
            </div>
            <div className="consignacion_label">{consignacion.fecha_final}</div>
            <div className="consignacion_label">{consignacion.responsable}</div>
          </div>
          <div className="consignacion_buttons">
            <Button
              variant="outline-info"
              onClick={() => this._handle_consignacion_modal(consignacion)}
            >
              Editar
            </Button>
            <Button
              variant="outline-danger"
              onClick={() =>
                this._delete_consignacion(
                  this.state.forma.selected_id["utr"],
                  consignacion,
                )
              }
            >
              Eliminar
            </Button>
          </div>
        </Card.Header>,
      );
    });
    return <CardGroup className="tab-container">{consignaciones}</CardGroup>;
  };

  // Manejar click para mostrar modal de consignación
  _handle_consignacion_modal = (consignacion: Consignacion) => {
    let form = this.state.forma;
    form["no_consignacion"] = consignacion.no_consignacion;
    form.detalle = consignacion.detalle.detalle;
    form.descripcion_corta = consignacion.detalle.descripcion_corta;
    this.setState({
      consignacion_to_edit: consignacion,
      show: true,
      forma: form,
    });
  };

  // Maneja el cierre de la modal:
  _handleClose = () => {
    this.setState({ show: false });
  };

  // render modal para editar consignación:
  _render_edit_consignacion_modal = () => {
    return (
      <Modal
        show={this.state.show}
        onHide={this._handleClose}
        animation={false}
        size="lg"
      >
        <Modal.Header translate closeButton>
          <Modal.Title>{"Editar consignación"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {this.state.consignacion_to_edit === undefined ? (
            <></>
          ) : (
            this._render_edit_form()
          )}
        </Modal.Body>
      </Modal>
    );
  };

  // render forma para editar:
  _render_edit_form = () => {
    let fecha_ini = new Date(this.state.consignacion_to_edit.fecha_inicio);
    let fecha_fin = new Date(this.state.consignacion_to_edit.fecha_final);
    return (
      <Form>
        <Form.Group as={Row}>
          <Col sm="5">
            <span className="cons-mandatory">* </span>
            <Form.Label>Código de consignación: </Form.Label>
            <Form.Control
              size="sm"
              type="text"
              placeholder="Ingrese código"
              defaultValue={this.state.consignacion_to_edit.no_consignacion}
              onChange={(e) => this._handle_form_changes(e, "no_consignacion")}
            />
          </Col>
          <Col sm="7">
            <span className="cons-mandatory">* </span>
            <Form.Label>Fecha de consignación: </Form.Label>
            <br></br>
            <DateRangeTime
              last_month={false}
              onPickerChange={this._handle_picker_change}
              ini_date={fecha_ini}
              end_date={fecha_fin}
            ></DateRangeTime>
          </Col>
          <Col sm="12">
            <Form.Label>Descripción corta de la consignación: </Form.Label>
            <Form.Control
              type="text"
              placeholder="Cambie descripción corta"
              defaultValue={
                this.state.consignacion_to_edit.detalle["descripcion_corta"]
              }
              onChange={(e) =>
                this._handle_form_changes(e, "descripcion_corta")
              }
            />
          </Col>
          <Col sm="12">
            <Form.Label>Observaciones/detalles: </Form.Label>
            <Form.Control
              as="textarea"
              aria-label="With textarea"
              placeholder="Cambie detalles"
              defaultValue={this.state.consignacion_to_edit.detalle["detalle"]}
              onChange={(e) => this._handle_form_changes(e, "detalle")}
            />
          </Col>
          <Col>
            <Form.Label>
              <span style={{ fontWeight: "bold" }}>Responsable: </span>{" "}
              {this.state.responsable}
            </Form.Label>
          </Col>
        </Form.Group>
        <Button
          variant="outline-info"
          onClick={this._send_consignacion_editada}
        >
          Editar consignación
        </Button>
      </Form>
    );
  };

  // enviar consignación editada:
  _send_consignacion_editada = () => {
    let path =
      SRM_API_URL +
      "/admin-consignacion/consignacion/" +
      this.state.forma.selected_id["utr"] +
      "/" +
      this.state.consignacion_to_edit.id_consignacion;
    if (this.state.forma["no_consignacion"].length === 0) {
      this.setState({ msg: "Ingrese un No de consignación válido" });
      return;
    }
    let payload = {
      no_consignacion: this.state.forma["no_consignacion"],
      fecha_inicio: to_yyyy_mm_dd_hh_mm_ss(this.state.forma.fecha_inicio),
      fecha_final: to_yyyy_mm_dd_hh_mm_ss(this.state.forma.fecha_final),
      detalle: {
        detalle: this.state.forma.detalle,
        descripcion_corta: this.state.forma.descripcion_corta,
      },
      responsable: this.state.responsable,
    };
    fetch(path, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.success) {
          this._consulta_consignaciones(true);
        }
        this.setState({
          msg: result.msg ? result.msg : "Error no definido",
          success: result.success,
          show: false,
        });
      })
      .catch(console.log);
  };

  render() {
    return (
      <div>
        <FilterSTRNodes onChange={this._handle_filter_STRNodes} />
        {this.state.forma.selected === undefined ? (
          <></>
        ) : (
          <Card>
            <Card.Header className="cons-header">
              {this.state.forma.selected["utr_tipo"] === undefined
                ? "Seleccione una UTR"
                : this.state.forma.selected["utr_tipo"]}{" "}
              {this.state.forma.selected["utr_nombre"] === undefined
                ? ""
                : this.state.forma.selected["utr_nombre"]}
            </Card.Header>
            <Card.Body>
              <Form>
                <Form.Group as={Row}>
                  <Col sm="3" style={{ minWidth: "350px" }}>
                    <Form.Label>Seleccione fecha de consulta: </Form.Label>
                    <br></br>
                    <DateRangeTime
                      last_month={true}
                      onPickerChange={this._handle_picker_change_to_consult}
                    ></DateRangeTime>
                  </Col>

                  <Col sm="1">
                    <Form.Label></Form.Label>
                    <br></br>
                    <Button
                      variant="primary"
                      disabled={
                        this.state.forma.selected_id === undefined ||
                        this.state.forma.selected_id["utr"] === undefined ||
                        this.state.loading
                      }
                      onClick={() => this._consulta_consignaciones()}
                    >
                      Consultar
                    </Button>
                  </Col>
                </Form.Group>
              </Form>
              {this._render_consignaciones()}
              {this.state.msg.length === 0 ? (
                <></>
              ) : (
                <Alert variant={this.state.success ? "success" : "warning"}>
                  {this.state.msg}
                </Alert>
              )}
            </Card.Body>
          </Card>
        )}
        {this._render_edit_consignacion_modal()}
      </div>
    );
  }
}

export default DatosConsultar;
