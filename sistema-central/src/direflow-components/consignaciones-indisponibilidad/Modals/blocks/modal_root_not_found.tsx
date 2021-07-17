import React, { Component } from "react";
import { Form, Modal } from "react-bootstrap";
import { root_block_form } from "../../types";
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

let modal_id = "Modal_root_not_found";

export class Modal_root_not_found extends Component<
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

  

  render() {
    return (
      <>
        <Modal
          show={this.state.show}
          onHide={this.handleClose}
          animation={false}
        >
          <Modal.Header translate={"true"} closeButton>
            <Modal.Title>No se puede desplegar este modelamiento</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="BlockName">
                <Form.Label>Error al buscar el modelamiento cuyo id publico es: "{this.props.public_id}"</Form.Label>
                <Form.Text className="text">
                  Este modelamiento no existe, o el id publico usado es incorrecto. Contacte al administrador.
                </Form.Text>
              </Form.Group>
            </Form>
          </Modal.Body>
        </Modal>
      </>
    );
  }
}
