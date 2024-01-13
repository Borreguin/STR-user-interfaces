import React, { Component } from "react";
import { Alert, Button, Col, Form } from "react-bootstrap";
import ReactTooltip from "react-tooltip";
import { SRM_API_URL } from "../../../../../Constantes";
import { Selected, SelectedID, UTR } from "../../../../Common/GeneralTypes";

export type SRCreateUTRProps = {
  selected: Selected;
  selected_id: SelectedID;
  handle_RTUs_changes?: Function;
};

export type SRCreateUTRState = {
  loading: boolean;
  success: boolean;
  utr_form: UTR;
  msg: string;
  utr_valid: boolean;
};

export class SRCreateUTR extends Component<SRCreateUTRProps, SRCreateUTRState> {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      success: true,
      utrs: [],
      utr_valid: false,
      msg: "",
      utr_form: {
        id_utr: "",
        utr_tipo: "",
        utr_code: "",
        utr_nombre: "",
        activado: true,
        protocol: "",
        latitude: 0,
        longitude: 0,
      },
    };
  }

  // manejar cambios de UTR:
  _handle_RTUs_changes = (utrs) => {
    if (this.props.handle_RTUs_changes !== undefined) {
      this.props.handle_RTUs_changes(utrs);
    }
  };

  // chequea la forma para la creación de una UTR
  _check_rtu_form = () => {
    let fields = ["id_utr", "utr_tipo", "utr_nombre", "protocol"];
    let valid = true;
    for (var idx in fields) {
      let f = fields[idx];
      valid =
        valid &&
        this.state.utr_form[f] !== undefined &&
        this.state.utr_form[f].length >= 3;
      if (!valid) {
        this.setState({
          msg: "Revise: El campo '" + f + "' es inválido o está incompleto.",
        });
        break;
      }
      this.setState({ msg: "" });
    }
    this.setState({ utr_valid: valid });
  };

  // Maneja cambios en la forma de rtu
  _handle_rtu_string_form_changes = (e, field) => {
    let rtu_form = this.state.utr_form;
    rtu_form[field] = e.target.value;
    this.setState({ utr_form: rtu_form });
    this._check_rtu_form();
  };

  //  maneja la edición de una RTU de campos tipo float
  _handle_rtu_float_form_changes = (e, field) => {
    let rtu_form = this.state.utr_form;
    rtu_form[field] = parseFloat(e.target.value);
    this.setState({ utr_form: rtu_form });
    this._check_rtu_form();
  };

  _post_rtu_form = async () => {
    this.setState({ success: false, msg: "" });
    let path = `${SRM_API_URL}/admin-sRemoto/rtu/${this.props.selected_id.nodo}/${this.props.selected_id.entidad}`;
    await fetch(path, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(this.state.utr_form),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          return {
            msg: "Ciertos parámetros no han sido ingresados correctamente",
          };
        }
      })
      .then((json) => {
        json.msg =
          (json.success
            ? "Operación exitosa en "
            : "Revise el detalle de esta UTR a crearse en ") +
          this.props.selected.entidad_tipo +
          " " +
          this.props.selected.entidad_nombre +
          ". " +
          json.msg;
        this._handle_RTUs_changes(json.utrs);
        this.setState({ success: json.success, msg: json.msg });
      })
      .catch(console.log);
  };

  // forma para crear RTUs
  _render_create_rtu_form = () => {
    return (
      <Form className="tab-container">
        {/* ID y TIPO UTR */}
        <Form.Row>
          <Form.Group as={Col} controlId="formIdUTR">
            <Form.Label>
              <span className="cons-mandatory">* </span> Id UTR
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingrese Id"
              onChange={(e) =>
                this._handle_rtu_string_form_changes(e, "id_utr")
              }
            />
          </Form.Group>
          <Form.Group as={Col} controlId="formTipoUTR">
            <Form.Label>
              <span className="cons-mandatory">* </span> Tipo
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingrese tipo"
              onChange={(e) =>
                this._handle_rtu_string_form_changes(e, "utr_tipo")
              }
            />
          </Form.Group>
        </Form.Row>
        {/* Nombre y Protocolo UTR */}
        <Form.Row>
          <Form.Group as={Col} controlId="formTipoUTR">
            <Form.Label>
              <span className="cons-mandatory">* </span> Nombre
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Nombre"
              onChange={(e) =>
                this._handle_rtu_string_form_changes(e, "utr_nombre")
              }
            />
          </Form.Group>
          <Form.Group as={Col} controlId="formTipoUTR">
            <Form.Label>
              <span className="cons-mandatory">* </span> Protocolo
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Protocolo"
              onChange={(e) =>
                this._handle_rtu_string_form_changes(e, "protocol")
              }
            />
          </Form.Group>
        </Form.Row>
        {/* latitud y longitud UTR */}
        <Form.Row>
          <Form.Group as={Col} controlId="formTipoUTR">
            <Form.Label>
              <span className="cons-mandatory">* </span> Latitud
            </Form.Label>
            <Form.Control
              type="number"
              step="0.001"
              placeholder="0"
              onChange={(e) =>
                this._handle_rtu_float_form_changes(e, "latitude")
              }
            />
          </Form.Group>
          <Form.Group as={Col} controlId="formTipoUTR">
            <Form.Label>
              <span className="cons-mandatory">* </span> Longitud
            </Form.Label>
            <Form.Control
              type="number"
              step="0.001"
              placeholder="0"
              onChange={(e) =>
                this._handle_rtu_float_form_changes(e, "longitude")
              }
            />
          </Form.Group>
        </Form.Row>
        {/* Activado */}
        <Form.Row>
          <Form.Group id="checkRTU" as={Col}>
            <Form.Check
              defaultChecked
              type="checkbox"
              label="Activada"
              onChange={() => {
                let utr_form = this.state.utr_form;
                utr_form["activado"] = !utr_form["activado"];
                this.setState({ utr_form: utr_form });
                this._check_rtu_form();
              }}
            />
          </Form.Group>
        </Form.Row>
        {/* Mensaje de estado */}
        <Form.Row>
          {this.state.msg.length === 0 ? (
            <></>
          ) : (
            <Alert variant={this.state.success ? "success" : "warning"}>
              {this.state.msg}
            </Alert>
          )}
        </Form.Row>
        {/*Boton de envío de información */}
        <Form.Row>
          <Form.Group id="checkRTU" as={Col}>
            <Button
              variant="outline-success"
              style={{ float: "right" }}
              disabled={!this.state.utr_valid}
              data-tip={
                "<div>Presione aquí para crear una nueva UTR</div>" +
                "<div>Revise todos los campos obligatorios (*)</div>" +
                "<div>mínimo 4 caracteres</div>"
              }
              data-html={true}
              onClick={this._post_rtu_form}
            >
              {"Crear UTR en " + this.props.selected.entidad_nombre}
            </Button>
            <ReactTooltip />
          </Form.Group>
        </Form.Row>
      </Form>
    );
  };

  render() {
    return this._render_create_rtu_form();
  }
}
