import React, { Component } from "react";
import { Button, Form } from "react-bootstrap";
import "./Sources.css";
import ReactJson from "react-json-view";
import { SCT_API_URL } from "../../../Constantes";
import { leaf_component } from "../types";

export interface props {
  handle_msg?: Function;
  handle_isValid?: Function;
  component: leaf_component;
}

export interface state {
  log: Object;
}

export class DesdeSubComponente extends Component<props, state> {
  constructor(props) {
    super(props);

    this.state = {
      log: { fuentes: this.props.component.sources },
    };
  }

  _handle_message = (msg) => {
    if (this.props.handle_msg !== undefined) {
      this.props.handle_msg(msg);
    }
  };
  _handle_isValid = (isvalid: boolean) => {
    if (this.props.handle_isValid !== undefined) {
      this.props.handle_isValid(isvalid);
    }
  };

  componentDidMount = () => {
    console.log("component", this.props.component);
  };

  _create_root_component = async () => {
    let path = `${SCT_API_URL}/component-leaf/comp-root/${this.props.component.parent_id}/comp-leaf/${this.props.component.public_id}/add-root-component`;

    let isValid = false;
    await fetch(path, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((resp) => resp.json())
      .then((json) => {
        this.setState({ log: json });
        isValid = true;
      })
      .catch((error) => {
        console.log(error);
        let log = {
          msg: "Error al conectarse con la API (api-sct)",
        };
        isValid = false;
        this.setState({ log: log });
      });
    this._handle_isValid(isValid);
  };

  render() {
    return (
      <>
        <Form.Group>
          <Form.Label>
            Esta opción permite modelar subcomponentes internos, lo que permite
            indicar a detalle la topología interna de este componente. Cada
            subcomponente interno tendrá la posibilidad de elegir un nuevo tipo
            de fuente asociado.
          </Form.Label>
          <Form.Label>
            <span style={{ color: "red" }}>Nota:</span> La creación de un
            subcomponente interno eliminará la fuente anteriormente configurada.
          </Form.Label>

          <Form.Row
            style={{
              marginTop: "17px",
              justifyContent: "end",
              marginRight: "10px",
            }}
          >
            <Button
              variant="outline-danger"
              className="test-manual-btn"
              onClick={this._create_root_component}
            >
              Crear subcomponente
            </Button>
          </Form.Row>
        </Form.Group>
        <Form.Group>
          <ReactJson
            name="log"
            displayObjectSize={true}
            collapsed={true}
            iconStyle="circle"
            displayDataTypes={false}
            theme="monokai"
            src={this.state.log}
          />
        </Form.Group>
      </>
    );
  }
}
