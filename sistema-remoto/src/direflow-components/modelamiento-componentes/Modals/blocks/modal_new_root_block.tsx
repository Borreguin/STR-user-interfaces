import React, { Component } from "react";
import { Alert, Button, Form, Modal } from "react-bootstrap";
import { SCT_API_URL } from "../../../../Constantes";
import { bloque_root, root_block_form } from "../../types";
export interface add_menu_props {
  public_id: string;
  handle_close?: Function;
  handle_message?: Function;
  handle_new_root_block?: Function;
}

export interface add_menu_state {
  show: boolean;
  form: root_block_form;
  message: string;
}

let modal_id = "Modal_new_root_block";

export class Modal_new_root_block extends Component<
  add_menu_props,
  add_menu_state
> {
  constructor(props) {
    super(props);
    this.state = {
      show: true,
      form: { name: undefined },
      message: "",
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

  handleNewRootBlock = (public_id, document, value) => {
    if (this.props.handle_new_root_block !== undefined) {
      // permite enviar el nuevo bloque root creado:
      this.props.handle_new_root_block(public_id, document, value);
    }
  };

  // INTERNAL FUNCTIONS:
  _handleShow = () => {
    this.setState({ show: true });
  };

  _handle_form_changes = (e, field) => {
    this.setState({ message: "" });

    let form = this.state.form;
    form[field] = e.target.value;
    this.setState({ form: form });
    if (!this._check_form()) {
      this.setState({
        message: "Se debe ingresar valores con mínimo 4 caracteres",
      });
    }
  };

  _check_form = () => {
    let fields = ["name"];
    let valid = true;
    fields.forEach((f) => {
      valid =
        valid &&
        this.state.form[f] !== undefined &&
        this.state.form[f].length > 4;
    });
    return valid;
  };

  _create_new_root_block = async () => {
    if (this._check_form()) {
      let path = SCT_API_URL + "/block-root/" + this.props.public_id;
      let payload = JSON.stringify(this.state.form);
      this.setState({ message: "Creando el contenedor de modelamiento" });
      // Creando el nuevo root block mediante la API
      await fetch(path, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: payload,
      })
        .then((res) => res.json())
        .then((json) => {
          if (json.success) {
            let bloqueroot = json.bloqueroot as bloque_root;
            this.handleNewRootBlock(bloqueroot.public_id, bloqueroot.document, bloqueroot);
            this.handleClose();
          } else {
            this.setState({ message: json.msg });
            this.handleMessages(json.msg);
          }
        })
        .catch((error) => {
          console.log(error);
          let msg =
            "Ha fallado la conexión con la API de modelamiento (api-sct). Error: " + error;
          this.setState({ message: msg});
          this.handleMessages(msg);
        });
    }
  };

  render() {
    return (
      <>
        <Modal
          show={this.state.show}
          onHide={this.handleClose}
          animation={false}
        >
          <Modal.Header translate={"true"} closeButton>
            <Modal.Title>Iniciando modelación</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="BlockName">
                <Form.Label>Ingrese el nombre del modelamiento:</Form.Label>
                <Form.Control
                  onChange={(e) => this._handle_form_changes(e, "name")}
                  type="text"
                  placeholder="Ingrese nombre"
                />
                <Form.Text className="text">
                  Para realizar la modelación de los bloques y componentes, es
                  necesario crear un bloque general que contenga toda la
                  modelación.
                </Form.Text>
              </Form.Group>
            </Form>
            {this.state.message.length === 0 ? (
              <></>
            ) : (
              <Alert variant="secondary" style={{ padding: "7px" }}>
                {this.state.message}
              </Alert>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="primary"
              disabled={!this._check_form()}
              onClick={this._create_new_root_block}
            >
              Crear modelamiento
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}
