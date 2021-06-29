import React, { Component, FC, useContext } from "react";
import { EventContext, Styled, withStyles } from "direflow-component";
import styles from "./App.css";
import { Modal_new_root_block } from "./Modals/blocks/modal_new_root_block";
import { SCT_API_URL } from "../../Constantes";
import { bloque_root } from "./types";
import bootstrap from "../../../public/bootstrap.4.3.1.css";
import { Alert, Button } from "react-bootstrap";

type props = {};
type state = {
  new_root: boolean;
  modal_show: boolean;
  loading: boolean;
  error: boolean;
  log: Object;
  bloqueroot: bloque_root | undefined;
};

// identify the public_id of this modeling process
const root_public_id = "disponibilidad_ems";

// Tagname de publicación en index.tsx
class ComponentModeling extends Component<props, state> {
  constructor(props) {
    super(props);
    this.state = {
      // Detects whether a root structure is needed or not
      new_root: false,
      modal_show: false,
      loading: false,
      error: false,
      log: { msg: "Empezando... Conectando con API-SCT" },
      bloqueroot: undefined,
    };
  }

  // manejar el cierre de los modales:
  handle_modal_close = (update: boolean) => {
    // let update_modal_show_state = this.state.modal_show;
    this.setState({ modal_show: update });
  };

  // maneja cambios en la estructura:
  handle_changes_in_structure = (
    public_id: string,
    document: string,
    value: Object
  ) => {
    console.log(public_id, document, value);
  };

  // busca la estructura basada en bloques y componentes:
  _search_root_block = async () => {
    this.setState({
      loading: true,
      error: false,
    });

    let path = SCT_API_URL + "/block-root/" + root_public_id;
    await fetch(path)
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          let bloqueroot = json.bloqueroot as bloque_root;
          this.setState({ bloqueroot: bloqueroot });
        } else {
          this.setState({
            new_root: true,
            log: {
              msg: "Es necesario crear un bloque principal para esta página",
            },
          });
        }
      })
      .catch((error) => {
        this.setState({
          error: true,
          log: {
            msg: "Ha fallado la conexión con la API de modelamiento (api-sct)",
          },
        });
        console.log(error);
      });
    this.setState({ loading: false });
  };

  // Permite desplegar la modal de inicio de modelación
  // Esto en el caso que aún no exista el root de modelado:
  is_needed_a_new_root = () => {
    if (!this.state.new_root) {
      return (
        <Modal_new_root_block
          public_id={root_public_id}
          handle_close={this.handle_modal_close}
          handle_new_root_block={this.handle_changes_in_structure}
        />
      );
    }
    return <div></div>;
  };

  render() {
    // previene retroceder la página en caso de pulsar la tecla de retroceso (número 8)
    window.onkeydown = (e: KeyboardEvent) => {
      if (e.key === "backspace")
        if (e.target === document.body) {
          e.preventDefault();
        }
    };
    return (
      <>
        <link rel="stylesheet" type="text/css" href="/wp-content/uploads/custom-css-js/bootstrap.4.3.1.css"></link>
        <link rel="stylesheet" type="text/css" href="bootstrap.4.3.1.css"></link>
        {
          // if there is need to create a new root structure:
          this.is_needed_a_new_root()
        }
        <Alert>hola</Alert>
         </>
    );
  }
}

export default withStyles([styles])(ComponentModeling);
