import React, { Component, useState } from "react";
import { Form } from "react-bootstrap";
import { SCT_API_URL } from "../../../Constantes";
import { block } from "../types";
import { DB_sistema_remoto } from "./DB_sistema_remoto";
import { DesdeSubComponente } from "./DesdeSubComponente";
import { Manual } from "./Manual";

export interface props {
  handle_msg?: Function;
  component: block;
}

export interface state {
  options: Array<JSX.Element>;
  select: string;
}

export class Sources extends Component<props, state> {
  constructor(props) {
    super(props);
    this.state = {
      options: [],
      select: "",
    };
  }

  _handle_message = (msg) => {
    if (this.props.handle_msg !== undefined) {
      this.props.handle_msg(msg);
    }
  };

  componentDidMount = () => {
    let path = `${SCT_API_URL}/options/sources`;
    fetch(path)
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          // creando lista de opciones
          let options = this.state.options;
          let ix = 0;
          for (const source of json.sources) {
            if (source !== null) {
              if (ix === 0) {
                this.setState({ select: source });
              }
              options.push(<option key={ix}>{source}</option>);
              ix += 1;
            }
          }
          this.setState({ options: options });
        } else {
          this._handle_message({ succes: false, msg: json.msg });
        }
      })
      .catch((error) =>
        this._handle_message({ success: false, error: "" + error })
      );
  };

  _handle_selection = (e) => {
    this.setState({ select: e.target.value });
  };

  show_source_form = () => {
    switch (this.state.select) {
      case "MANUAL":
        return <Manual component={this.props.component} />;
      case "BD SIST.REMOTO":
        return <DB_sistema_remoto />;
      case "HISTORICO":
        return <>HISTORICO</>;
      case "DESDE SUBCOMPONENTE":
        return <DesdeSubComponente component={this.props.component}/>
    }

    return <>No hay forma asociada a esta fuente</>;
  };

  render() {
    return (
      <>
        <Form.Control as="select" onChange={this._handle_selection}>
          {this.state.options}
        </Form.Control>
        <div className="source-container">{this.show_source_form()}</div>
      </>
    );
  }
}
