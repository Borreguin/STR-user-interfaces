import React, { Component } from "react";
import { Alert, Button, Col, Form } from "react-bootstrap";
import ReactTooltip from "react-tooltip";
import { SRM_API_URL } from "../../../../Constantes";
import { Selected, SelectedID, UTR } from "../../../Common/GeneralTypes";


type SREditarUTRProps = {
  // utrs: Array<UTR>;
  selected: Selected;
  selected_id: SelectedID;
  utrs: Array<UTR>;
  handle_RTUs_changes?: Function;
};

type SREditarUTRState = {
  loading: boolean;
  success: boolean;
  options: Array<any>;
  utr_form: UTR;
  utrs: Array<UTR>;
  msg: string;
  utr_valid: boolean;
};

export class SREditarUTR extends Component<SREditarUTRProps, SREditarUTRState> {
  selected_entity: string;
  selected_utr_id: string;
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      success: true,
      options: [],
      utrs: [],
      utr_valid: false,
      msg: "",
      utr_form: {
        id_utr: "",
        utr_tipo: "",
        utr_code: "",
        utr_nombre: "",
        activado: true,
        longitude: 0,
        latitude: 0,
        protocol: "",
      },
    };
    this.selected_entity = "";
    this.selected_utr_id = "";
  }

  // Función que permite iniciar el componente
  componentDidMount = () => {
    this._get_utrs();
  };

  // Función que permite actualizar el listado de UTRS ante un cambio exterior
  componentDidUpdate() {
    // actualizando el controlador de selección de UTRs
    // Garantizar que sea la última selección:
    if (
      this.selected_entity !== this.props.selected.entidad_nombre &&
      !this.state.loading
    ) {
      this._get_utrs();
      this.selected_entity = this.props.selected.entidad_nombre;
    }
    if (this.state.utrs !== this.props.utrs) {
      // Recuperando los cambios desde otros módulos
      this.setState(
        { utrs: this.props.utrs },
        // Una vez efectuado el cambio de estado, entonces ejecutar lo siguiente:
        () => this._rtu_options()
      );
    }
  }

  // manejar cambios de UTR:
  _handle_RTUs_changes = (utrs) => {
    if (this.props.handle_RTUs_changes !== undefined) {
      this.props.handle_RTUs_changes(utrs);
    }
  };

  // chequea la forma para la creación de una UTR
  _check_rtu_form = () => {
    let fields = ["utr_tipo", "utr_nombre", "protocol"];
    let valid = true;
    for (var idx in fields) {
      let f = fields[idx];
      valid =
        valid &&
        this.state.utr_form[f] !== undefined &&
        this.state.utr_form[f].length > 3;
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

  // Identifica la RTU seleccionada:
  _handle_rtu_select = (e) => {
    let id_utr = e.target.value;
    let selected_utr = this.state.utr_form;
    // variable a ser compartida de manera global
    this.selected_utr_id = id_utr;
    this.state.utrs.forEach((_rtu) => {
      if (_rtu.id_utr === id_utr) {
        selected_utr.id_utr = _rtu.id_utr;
        selected_utr.utr_nombre = _rtu.utr_nombre;
        selected_utr.utr_tipo = _rtu.utr_tipo;
        selected_utr.activado = _rtu.activado;
        selected_utr.protocol = _rtu.protocol;
        selected_utr.latitude = _rtu.latitude;
        selected_utr.longitude = _rtu.longitude;
        this.setState({ utr_form: selected_utr });
      }
    });
  };

  //  maneja la edición de una RTU de campos tipo string
  _edit_rtu_string_form_changes = (e, field) => {
    let rtu_form = this.state.utr_form;
    rtu_form[field] = e.target.value;
    this.setState({ utr_form: rtu_form });
    this._check_rtu_form();
  };

  //  maneja la edición de una RTU de campos tipo float
  _edit_rtu_float_form_changes = (e, field) => {
    let rtu_form = this.state.utr_form;
    rtu_form[field] = parseFloat(e.target.value);
    this.setState({ utr_form: rtu_form });
    this._check_rtu_form();
  };

  // Convierte la lista de RTUs en un ComboBox
  _rtu_options = () => {
    let options = [];
    this.state.utrs.forEach((utr, ix) => {
      if (ix === 0) { this.selected_utr_id = utr.id_utr };
      options.push(<option key={ix}>{utr.id_utr}</option>);
    });
    this.setState({ options: options });
  };

  // Trae la lista de RTUs de este nodo e identidad
  _get_utrs = () => {
    let path =
      SRM_API_URL +
      "/admin-sRemoto/rtu/" +
      this.props.selected_id.nodo +
      "/" +
      this.props.selected_id.entidad;
    this.setState({
      loading: true,
      options: [<option key={0}>Cargando...</option>],
      utrs: [],
    });

    fetch(path)
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          this.setState({ utrs: json.utrs, loading: false });
          this._handle_RTUs_changes(json.utrs);
        }
        this._rtu_options();
        if (json.utrs.length > 0) {
          this.setState({ utr_form: json.utrs[0] });
        }
      })
      .catch(console.log);
  };

  _send_rtu_form = () => {
    this.setState({ success: false, msg: "" });
    let path =
      SRM_API_URL +
      "/admin-sRemoto/rtu/" +
      this.props.selected_id.nodo +
      "/" +
      this.props.selected_id.entidad;
    fetch(path, {
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
          let error = {
            msg: "Ciertos parámetros no han sido ingresados correctamente",
          };
          return error;
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


  // forma para editar RTUs
  _render_edit_rtu_form = () => {
    return (
      <Form className="tab-container">
        <Form.Row>
          <Form.Group as={Col} controlId="formIdUTR">
            <Form.Label>Click para seleccionar UTR:</Form.Label>
            <Form.Control
              as="select"
              placeholder="Seleccione ID"
              onChange={this._handle_rtu_select}
              style={{backgroundColor:"rgba(240, 213, 133, 0.774)"}}
            >
              {this.state.options}
            </Form.Control>
          </Form.Group>
          <Form.Group as={Col} controlId="formTipoUTR">
            <Form.Label>
              <span className="cons-mandatory">* </span> Tipo
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingrese tipo"
              value={this.state.utr_form.utr_tipo}
              onChange={(e) =>
                this._edit_rtu_string_form_changes(e, "utr_tipo")
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
              value={this.state.utr_form.utr_nombre}
              onChange={(e) =>
                this._edit_rtu_string_form_changes(e, "utr_nombre")
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
              value={this.state.utr_form.protocol}
              onChange={(e) =>
                this._edit_rtu_string_form_changes(e, "protocol")
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
              value={this.state.utr_form.latitude}
              onChange={(e) => this._edit_rtu_float_form_changes(e, "latitude")}
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
              value={this.state.utr_form.longitude}
              onChange={(e) =>
                this._edit_rtu_float_form_changes(e, "longitude")
              }
            />
          </Form.Group>
        </Form.Row>
        {/* Activado */}
        <Form.Row>
          <Form.Group id="checkRTU" as={Col}>
            <Form.Check
              type="checkbox"
              label="Activada"
              checked={this.state.utr_form.activado}
              onChange={() => {
                let edited_utr = this.state.utr_form;
                edited_utr.activado = !edited_utr.activado;
                this.setState({ utr_form: edited_utr });
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
              variant="outline-primary"
              style={{ float: "right" }}
              disabled={!this.state.utr_valid}
              data-tip={
                "<div>Presione aquí para editar la UTR</div>" +
                "<div>Revise todos los campos obligatorios (*)</div>" +
                "<div>mínimo 4 caracteres</div>"
              }
              data-html={true}
              onClick={this._send_rtu_form}
            >
              {"Editar UTR " + this.selected_utr_id}
            </Button>
            <ReactTooltip />
          </Form.Group>
        </Form.Row>
      </Form>
    );
  };

  render() {
    return this._render_edit_rtu_form();
  }
}
