import React, { Component } from "react";
import { Alert, Button, Form, Modal } from "react-bootstrap";
import { SCT_API_URL } from "../../../../Constantes";
import { bloque_leaf, leaf_block_form } from "../../types";

export interface menu_props {
  object: bloque_leaf;
  handle_close?: Function;
  handle_edited_root_block?: Function;
  handle_message?: Function;
}

export interface menu_state {
  show: boolean;
  form: leaf_block_form;
  message: string;
}

let modal_id = "modal_edit_block";

export class Modal_edit_block extends Component<menu_props, menu_state> {
  constructor(props) {
    super(props);
    this.state = {
      show: true,
      form: { name: undefined },
      message: "",
    };
  }
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
  // Edita los atributos de un bloque interno
  _onclick_edit = () => {
    if (this._check_form()) {
      let path = `${SCT_API_URL}/block-leaf/block-root/${this.props.object.parent_id}/block-leaf/${this.props.object.public_id}`;
      let payload = JSON.stringify(this.state.form);
      this.setState({ message: "Editando bloque interno..." });
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
          this.setState({ message: json.msg });
          if (json.success) {
            this.handleEditedRootBlock(json.bloqueroot);
            // this.handleClose();
          } else {
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
    /*if (
      this.props.block === undefined ||
      this.props.static_menu === undefined
    ) {
      return <div>No existen parámetros suficientes</div>;
    }*/
    return (
      <>
        <Modal
          show={this.state.show}
          onHide={this.handleClose}
          animation={false}
        >
          <Modal.Header translate={"true"} closeButton>
            <Modal.Title>Edición del bloque interno:</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="EditBlockName">
                <Form.Label>Cambiar el nombre del bloque:</Form.Label>
                <Form.Control
                  onChange={(e) => this._handle_form_changes(e, "name")}
                  type="text"
                  placeholder="Ingrese nuevo nombre"
                />
              </Form.Group>
              {this.state.message.length === 0 ? (
                <></>
              ) : (
                <Alert variant="secondary" style={{ padding: "7px" }}>
                  {this.state.message}
                </Alert>
              )}
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleClose}>
              Cancelar
            </Button>
            <Button
              variant="warning"
              onClick={this._onclick_edit}
              disabled={!this._check_form()}
            >
              Editar {this.props.object.name}
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

export const modal_edit_block_function = (
  object: bloque_leaf,
  handle_close: Function,
  handle_changes_in_root: Function
) => {
  return (
    <Modal_edit_block
      object={object}
      handle_close={handle_close}
      handle_edited_root_block={handle_changes_in_root}
    />
  );
};
