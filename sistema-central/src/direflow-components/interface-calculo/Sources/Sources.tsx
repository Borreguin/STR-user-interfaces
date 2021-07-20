import { faCog, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { Component } from "react";
import { Form } from "react-bootstrap";
import { SCT_API_URL } from "../../../Constantes";
import { leaf_component, source } from "../types";
import { DB_sistema_remoto } from "./DB_sistema_remoto";
import { DesdeSubComponente } from "./DesdeSubComponente";
import { Historico } from "./Historico";
import { Manual } from "./Manual";

export interface props {
  handle_msg?: Function;
  component: leaf_component;
}

export interface state {
  options: Array<JSX.Element>;
  select: string;
  sources: Array<source>;
}

export class Sources extends Component<props, state> {
  constructor(props) {
    super(props);
    this.state = {
      options: [],
      select: "",
      sources: this.props.component.sources,
    };
  }

  _handle_message = (msg) => {
    if (this.props.handle_msg !== undefined) {
      this.props.handle_msg(msg);
    }
  };

  _handle_sources_changes = (json) => {
    if (json.sources !== undefined) {
      this.setState({sources: json.sources});
    }
  }

  delete_source = (_type) => {
    let path = `${SCT_API_URL}/component-leaf/comp-root/${this.props.component.parent_id}/comp-leaf/${this.props.component.public_id}/configure-source`;
    fetch(path, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ type: _type }),
    })
      .then((resp) => resp.json())
      .then((json) => {
        this._handle_message(json);
        if (json.success) {
          this.setState({ sources: json.sources });
        }
      })
      .catch((error) => {
        console.log(error);
        let log = {
          msg: "Error al conectarse con la API (api-sct)",
        };
        this._handle_message(log);
      });
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
        return <Manual component={this.props.component} handle_sources_changes={this._handle_sources_changes} />;
      case "BD SIST.REMOTO":
        return <DB_sistema_remoto component={this.props.component}  handle_sources_changes={this._handle_sources_changes}/>;
      case "HISTORICO":
        return <Historico component={this.props.component}  handle_sources_changes={this._handle_sources_changes}/>;
      case "DESDE SUBCOMPONENTE":
        return <DesdeSubComponente component={this.props.component} />;
    }

    return <>No hay forma asociada a esta fuente</>;
  };

  _show_configurated_sources = () => {
    let sources = [];
    for (const source of this.state.sources) {
      let source_container = (
        <div key={source.type} className="source-item">
          <div className="source-label">{source.type}</div>
          <span
            className="source-delete"
            onClick={(e) => this.delete_source(source.type)}
          >
            <FontAwesomeIcon icon={faTrash} />
          </span>
        </div>
      );
      sources.push(source_container);
    }
    return sources;
  };

  render() {
    return (
      <>
        <Form.Label>Fuentes configuradas:</Form.Label>
        <Form.Row className="source-list">
          {this._show_configurated_sources()}
        </Form.Row>
        <br></br>
        <Form.Label>Configure una fuente de datos:</Form.Label>
        <Form.Control as="select" onChange={this._handle_selection}>
          {this.state.options}
        </Form.Control>
        <div className="source-container">{this.show_source_form()}</div>
      </>
    );
  }
}
