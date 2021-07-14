import React, { Component } from "react";
import { Alert, Button, Col, Form, Modal } from "react-bootstrap";
import { SCT_API_URL } from "../../../../Constantes";
import { Sources } from "../../Sources/Sources";
import { leaf_component, root_component_form } from "../../types";
export interface add_menu_props {
  object: leaf_component;
  handle_close?: Function;
  handle_message?: Function;
  handle_edited_root_block?: Function;
}

export interface add_menu_state {
  show: boolean;
  form: root_component_form;
  message: string;
}

let modal_id = "Modal_edit_component";

// Edición de un componente LEAF:
export class Modal_edit_component extends Component<
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
  // Edita un componente root mediante: id del bloque root, id del bloque leaf e id del componente
  _onclick_edit = () => {
    if (this._check_form()) {
      let path = `${SCT_API_URL}/component-leaf/comp-root/${this.props.object.parent_id}/comp-leaf/${this.props.object.public_id}`;
      let payload = JSON.stringify(this.state.form);
      this.setState({ message: "Editando el componente" });
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
          /*if (json.success) {
            this.handleEditedRootBlock(json.bloqueroot);
            // this.handleClose();
          } else {
            this.handleMessages(json.msg);
          }*/
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
          size="lg"
        >
          <Modal.Header translate={"true"} closeButton>
            <Modal.Title>Editar configuraciones</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="EditBlockName">
                <Form.Label>Cambiar nombre del componente:</Form.Label>
                <Form.Row>
                  <Col sm="9">
                    <Form.Control
                      onChange={(e) => this._handle_form_changes(e, "name")}
                      defaultValue={this.props.object.name}
                      type="text"
                      placeholder="Ingrese nuevo nombre"
                    />
                  </Col>
                  <Col sm="3">
                    <Button
                      variant="info"
                      disabled={!this._check_form()}
                      onClick={this._onclick_edit}
                    >
                      Editar
                    </Button>
                  </Col>
                </Form.Row>
              </Form.Group>

              <Form.Group>
                
                  <Sources
                    component={this.props.object as leaf_component}
                  ></Sources>
                
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
            <Button variant="success" onClick={this.handleClose}>
              Aceptar
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

export const modal_edit_component_function = (
  object: leaf_component,
  handle_close: Function,
  handle_changes_in_root: Function
) => {
  return (
    <Modal_edit_component
      object={object}
      handle_close={handle_close}
      handle_edited_root_block={handle_changes_in_root}
    />
  );
};
