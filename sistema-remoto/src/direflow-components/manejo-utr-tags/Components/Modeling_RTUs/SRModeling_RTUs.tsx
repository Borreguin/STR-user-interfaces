import React, { Component } from "react";
import { Tab, Form, Col, Tabs, Button, Alert } from "react-bootstrap";
import ReactTooltip from "react-tooltip";
import { SREliminarUTR } from "./SREliminarUTR";
import { SRCreateUTR } from "./SRCreateUTR";
import { SREditarUTR } from "./SREditarUTR";
import { Selected, SelectedID, UTR } from "../../../Common/GeneralTypes";
import { SRM_API_URL } from "../../../../Constantes";

type SRModelingRTUProps = {
  selected: Selected;
  selected_id: SelectedID;
};

type SRModelingRTUState = {
  utr_valid: boolean; // check
  utr_form: Object; // check
  success: boolean;
  msg: string;
  utrs: Array<UTR>;
  options: Array<any>; //check
  edited_utr_valid: boolean;
  edited_utr: UTR;
  loading: boolean;
};

class SRModelingRTU extends Component<SRModelingRTUProps, SRModelingRTUState> {
  selected_entity: string; // check
  constructor(props) {
    super(props);
    this.state = {
      utr_valid: false,
      utr_form: {
        id_utr: "",
        tipo: "",
        nombre: "",
        activado: true,
      },
      success: false,
      msg: "",
      utrs: [],
      options: [],
      edited_utr_valid: false,
      edited_utr: {
        id_utr: "",
        utr_code: "",
        utr_tipo: "",
        utr_nombre: "",
        activado: true,
        longitude: 0,
        latitude: 0,
        protocol: "",
      },
      loading: false,
    };
    this.selected_entity = "";
  }

  componentDidMount = () => {
    this._get_utrs();
  };

  componentDidUpdate() {
    // actualizando el controlador de selección de UTRs
    if (this.selected_entity !== this.props.selected.entidad_nombre) {
      this.setState({
        options: [<option key={0}>Cargando...</option>],
        utrs: [],
      });
      this._get_utrs();
      this.selected_entity = this.props.selected.entidad_nombre;
    }
  }

  handle_RTUs_changes = (utrs) => {
    this.setState({ utrs: utrs });
  };

  // Convierte la lista de RTUs en un ComboBox
  _rtu_options = () => {
    let options = [];
    this.state.utrs.forEach((utr, ix) => {
      options.push(<option key={ix}>{utr.id_utr}</option>);
    });
    this.setState({ options: options });
  };

  // Trae la lista de RTUs de este nodo e identidad
  _get_utrs = async () => {
    let path = `${SRM_API_URL}/admin-sRemoto/rtu/${this.props.selected_id.nodo}/${this.props.selected_id.entidad}`;

    fetch(path)
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          let utrs = json.utrs;
          utrs.sort((a, b) => (a.utr_nombre > b.utr_nombre ? 1 : -1));
          this.setState({ utrs: utrs });
        }
        this._rtu_options();
      })
      .catch(console.log);
  };

  // Identifica la RTU seleccionada:
  _handle_rtu_select = (e) => {
    let id_utr = e.target.value;
    let selected_utr = this.state.edited_utr;
    this.state.utrs.forEach((_rtu) => {
      if (_rtu.id_utr === id_utr) {
        selected_utr.id_utr = _rtu.id_utr;
        selected_utr.utr_nombre = _rtu.utr_nombre;
        selected_utr.utr_tipo = _rtu.utr_tipo;
        selected_utr.activado = _rtu.activado;
        this.setState({ edited_utr: selected_utr });
      }
    });
  };

  // chequea la forma para la creación de una UTR
  _check_rtu_form = () => {
    let fields = ["id_utr", "tipo", "nombre"];
    let valid = true;
    fields.forEach((f) => {
      valid =
        valid &&
        this.state.utr_form[f] !== undefined &&
        this.state.utr_form[f].length >= 3;
    });
    this.setState({ utr_valid: valid });
  };

  // Chequea la forma de edición de una UTR
  _check_edited_rtu_form = () => {
    let fields = ["utr_tipo", "utr_nombre"];
    let valid = true;
    fields.forEach((f) => {
      valid =
        valid &&
        this.state.edited_utr[f] !== undefined &&
        this.state.edited_utr[f].length >= 3;
    });
    this.setState({ edited_utr_valid: valid });
  };

  // Maneja cambios en la forma de rtu
  _handle_rtu_form_changes = (e, field) => {
    let rtu_form = this.state.utr_form;
    rtu_form[field] = e.target.value;
    this.setState({ utr_form: rtu_form });
    this._check_rtu_form();
  };

  //  maneja la edición de una RTU de campos tipo string
  _edit_rtu_string_form_changes = (e, field) => {
    let rtu_form = this.state.edited_utr;
    rtu_form[field] = e.target.value;
    this.setState({ utr_form: rtu_form });
    this._check_edited_rtu_form();
  };

  //  maneja la edición de una RTU de campos tipo float
  _edit_rtu_float_form_changes = (e, field) => {
    let rtu_form = this.state.edited_utr;
    rtu_form[field] = parseFloat(e.target.value);
    this.setState({ utr_form: rtu_form });
    this._check_edited_rtu_form();
  };

  _send_rtu_form = () => {
    this.setState({ success: false, msg: "" });
    console.log(this.state.utr_form);
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
      .then((res) => res.json())
      .then((json) => {
        json.msg =
          (json.success ? "Operación exitosa en " : "Revise el detalle para ") +
          this.props.selected.entidad_tipo +
          " " +
          this.props.selected.entidad_nombre +
          " " +
          json.msg;
        this._get_utrs();
        this.setState({ success: json.success, msg: json.msg });
      })
      .catch(console.log);
  };

  _send_edit_rtu_form = () => {
    let form = this.state.utr_form;
    form["id_utr"] = this.state.edited_utr.id_utr;
    form["tipo"] = this.state.edited_utr.utr_tipo;
    form["nombre"] = this.state.edited_utr.utr_nombre;
    form["activado"] = this.state.edited_utr.activado;
    this.setState({ utr_form: form });
    this._send_rtu_form();
  };

  // forma para editar RTUs
  _render_edit_rtu_form = () => {
    return (
      <Form className="tab-container">
        <Form.Row>
          <Form.Group as={Col} controlId="formIdUTR">
            <Form.Label>Id UTR</Form.Label>
            <Form.Control
              as="select"
              placeholder="Seleccione ID"
              onChange={this._handle_rtu_select}
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
              value={this.state.edited_utr.utr_tipo}
              onChange={(e) =>
                this._edit_rtu_string_form_changes(e, "utr_tipo")
              }
            />
          </Form.Group>
        </Form.Row>
        <Form.Row>
          <Form.Group as={Col} controlId="formTipoUTR">
            <Form.Label>
              <span className="cons-mandatory">* </span> Nombre
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Nombre"
              value={this.state.edited_utr.utr_nombre}
              onChange={(e) =>
                this._edit_rtu_string_form_changes(e, "utr_nombre")
              }
            />
          </Form.Group>
        </Form.Row>
        <Form.Row>
          <Form.Group id="checkRTU" as={Col}>
            <Form.Check
              type="checkbox"
              label="Activada"
              checked={this.state.edited_utr.activado}
              onChange={(e) => {
                let edited_utr = this.state.edited_utr;
                edited_utr.activado = !edited_utr.activado;
                this.setState({ edited_utr: edited_utr });
                this._check_edited_rtu_form();
              }}
            />
          </Form.Group>
          <Form.Group id="checkRTU" as={Col}>
            <Button
              variant="outline-primary"
              style={{ float: "right" }}
              disabled={!this.state.edited_utr_valid}
              data-tip={
                "<div>Presione aquí para editar la UTR</div>" +
                "<div>Revise todos los campos obligatorios (*)</div>" +
                "<div>mínimo 4 caracteres</div>"
              }
              data-html={true}
              onClick={this._send_edit_rtu_form}
            >
              {"Editar UTR en " + this.props.selected.entidad_nombre}
            </Button>
            <ReactTooltip />
          </Form.Group>
        </Form.Row>
      </Form>
    );
  };

  render() {
    return (
      <div className="tab-container">
        <Tabs
          defaultActiveKey="dt-editar-utr"
          id="un-tab-mod"
          transition={false}
        >
          <Tab eventKey="dt-create-utr" title="Crear UTR">
            <SRCreateUTR
              selected={this.props.selected}
              selected_id={this.props.selected_id}
              handle_RTUs_changes={this.handle_RTUs_changes}
            ></SRCreateUTR>
          </Tab>
          <Tab eventKey="dt-editar-utr" title={"Editar UTR"}>
            <SREditarUTR
              selected={this.props.selected}
              selected_id={this.props.selected_id}
              utrs={this.state.utrs}
              handle_RTUs_changes={this.handle_RTUs_changes}
            ></SREditarUTR>
          </Tab>
          <Tab eventKey="dt-eliminar-utr" title="Eliminar UTR">
            <SREliminarUTR
              selected_nodo_id={this.props.selected_id.nodo}
              selected_entidad_id={this.props.selected_id.entidad}
              utrs={this.state.utrs}
              handle_RTUs_changes={this.handle_RTUs_changes}
            ></SREliminarUTR>
          </Tab>
        </Tabs>
        {this.state.msg.length === 0 ? (
          <></>
        ) : (
          <Alert variant={this.state.success ? "success" : "warning"}>
            {this.state.msg}
          </Alert>
        )}
      </div>
    );
  }
}
export default SRModelingRTU;
