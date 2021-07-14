import React, { Component, useState } from "react";
import { Alert, Button, Form, Modal } from "react-bootstrap";
import { SCT_API_URL } from "../../../../Constantes";
import { bloque_root, root_block_form } from "../../types";
export interface add_menu_props {
  object: bloque_root;
  handle_close?: Function;
  handle_message?: Function;
  handle_edited_root_block?: Function;
}

export interface add_menu_state {
  show: boolean;
  form: root_block_form;
  message: string;
}

let modal_id = "Modal_edit_root_block";

export class Modal_edit_root_block extends Component<
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

  handleShow = () => {
    this.setState({ show: true });
  };

  handleEditedRootBlock = (bloqueroot) => {
    if (this.props.handle_edited_root_block !== undefined) {
      // permite enviar el bloque root editado:
      this.props.handle_edited_root_block(bloqueroot);
    }
  };

  // INTERNAL FUNCTIONS:
  _onclick_edit = () => {
    if (this._check_form()) {
      let path = SCT_API_URL + "/block-root/" + this.props.object.public_id;
      let payload = JSON.stringify(this.state.form);
      this.setState({ message: "Editando el contenedor de modelamiento" });
      // Creando el nuevo root block mediante la API
      fetch(path, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: payload,
      })
        .then((res) => res.json())
        .then((json) => {
          if (json.success) {
            this.handleEditedRootBlock(json.bloqueroot);
            // this.handleClose();
          } else {
            this.setState({ message: json.msg });
            this.handleMessages(json.msg);
          }
        })
        .catch((error) => {
          console.log(error);
          let msg =
            "Ha fallado la conexión con la API de modelamiento (api-sct)";
          this.setState({ message: msg });
          this.handleMessages(msg);
        });
    }
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

  render() {
    return (
      <>
        <Modal
          show={this.state.show}
          onHide={this.handleClose}
          animation={false}
        >
          <Modal.Header translate={"true"} closeButton>
            <Modal.Title>
              Editar configuraciones generales de este modelamiento
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="EditBlockName">
                <Form.Label>Cambiar el nombre del modelamiento:</Form.Label>
                <Form.Control
                  onChange={(e) => this._handle_form_changes(e, "name")}
                  type="text"
                  placeholder="Ingrese nuevo nombre"
                />
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
            <Button variant="secondary" onClick={this.handleClose}>
              Cancelar
            </Button>
            <Button
              variant="warning"
              disabled={!this._check_form()}
              onClick={this._onclick_edit}
            >
              Editar bloque general
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

export const modal_edit_root_block_function = (
  object: bloque_root,
  handle_modal_close: Function,
  handle_changes_in_root: Function
) => {
  return (
    <Modal_edit_root_block
      object={object}
      handle_close={handle_modal_close}
      handle_edited_root_block={handle_changes_in_root}
    />
  );
};
