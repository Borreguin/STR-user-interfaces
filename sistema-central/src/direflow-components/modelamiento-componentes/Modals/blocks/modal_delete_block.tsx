import React, { Component } from "react";
import { Alert, Button, Form, Modal } from "react-bootstrap";
import { SCT_API_URL } from "../../../../Constantes";
import { bloque_leaf } from "../../types";

export interface modal_props {
  object: bloque_leaf;
  handle_close?: Function;
  handle_edited_root_block?: Function;
  handle_message?: Function;
}

export interface modal_state {
  show: boolean;
  message: string;
}

let modal_id = "Modal_delete_block";

export class Modal_delete_block extends Component<
  modal_props,
  modal_state
> {
  constructor(props) {
    super(props);
    this.state = {
      show: true,
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
  handleEditedRootBloack = (bloqueroot) => {
    if (this.props.handle_edited_root_block !== undefined) {
      // permite enviar el bloque root editado:
      this.props.handle_edited_root_block(bloqueroot);
    }
  };

  // INTERNAL FUNCTIONS:
  // Elimina un bloque interno de un bloque root
  _onclick_delete = () => {
    let path = `${SCT_API_URL}/block-leaf/block-root/${this.props.object.parent_id}/block-leaf/${this.props.object.public_id}`;
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
        if (json.success) {
          this.handleEditedRootBloack(json.bloqueroot);
          this.handleClose();
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

  render() {
    /*if (
      this.props.object === undefined ||
      this.props.block === undefined
    ) {
      return <div>No hay configuraciones para este elemento</div>;
    }*/
    return (
      <>
        <Modal
          show={this.state.show}
          onHide={this.handleClose}
          animation={false}
        >
          <Modal.Header translate={"true"} closeButton>
            <Modal.Title>Eliminación de bloque interno</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="BlockName">
                <Form.Label>
                  Desea eliminar el bloque interno: {this.props.object.name}?{" "}
                </Form.Label>
                <Form.Text>
                  Esta acción es permanente y se eliminará todo el contenido
                  interno de este bloque, esto incluye todos los componentes
                  internos modelados.{" "}
                </Form.Text>
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
            <Button variant="outline-danger" onClick={this._onclick_delete}>
              Eliminar {this.props.object.name}
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

export const modal_delete_block_function = (
  object: bloque_leaf,
  handle_close: Function,
  handle_changes_in_root: Function
) => {
  return (
    <Modal_delete_block
      object={object}
      handle_close={handle_close}
      handle_edited_root_block={handle_changes_in_root}
    />
  );
};
