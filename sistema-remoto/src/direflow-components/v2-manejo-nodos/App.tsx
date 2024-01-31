import React, { Component } from "react";
import { Styled } from "direflow-component";
import styles from "./App.css";
import { Spinner, Form, Row, Col, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import iconStyles from "@fortawesome/fontawesome-svg-core/styles.css";
import bootstrap from "bootstrap/dist/css/bootstrap.min.css";
import DropZone from "../Common/Upload/DropZone.css";
import Progress from "../Common/Upload/Progress.css";
import Upload from "../Common/Upload/Upload.css";
import { SRM_API_URL } from "../../Constantes";
import { new_node, Node } from "./Types";
import NodePanelV2 from "./Components/NodePanelV2";

interface NodeManagement_props {}

interface NodeManagement_state {
  nodes: Array<Node>;
  search: string;
  loading: boolean;
  filter_nodes: Array<Node>;
  msg: string;
  error: boolean;
}

// Tagname de publicación en index.tsx
class NodeManagementV2 extends Component<
  NodeManagement_props,
  NodeManagement_state
> {
  constructor(props: Readonly<NodeManagement_props>) {
    super(props);
    this.state = {
      nodes: [],
      search: "",
      loading: false,
      filter_nodes: [],
      msg: "",
      error: false,
    };
  }

  async componentDidMount() {
    this._search_nodes_now();
  }

  _search_nodes_now = async () => {
    this.setState({ nodes: [], loading: true, error: false });
    let path = SRM_API_URL + "/admin-sRemoto/v2/nodos/" + this.state.search;
    await fetch(path)
      .then((res) => res.json())
      .then((json) => {
        if (!json.success) {
          this.setState({ nodes: [], filter_nodes: [], msg: json.msg });
        } else {
          let nodes = json.nodos;
          nodes.sort((a: Node, b: Node) => (a.nombre > b.nombre ? 1 : -1));
          this.setState({ nodes: nodes, filter_nodes: nodes, msg: json.msg });
        }
      })
      .catch((error) => {
        this.setState({
          error: true,
          msg: "Ha fallado la conexión con la API de cálculo de Sistema Remoto",
        });
        console.log(error);
      });
    this.setState({ loading: false });
  };

  _filter = (e: React.ChangeEvent<HTMLInputElement>) => {
    let filtered_nodes: Node[] = [];
    let to_filter = e.target.value.toLowerCase();
    if (this.state.nodes.length === 0) return;
    this.state.nodes.forEach((node) => {
      if (node.nombre.toLowerCase().includes(to_filter)) {
        filtered_nodes.push(node);
      }
    });
    this.setState({ filter_nodes: filtered_nodes });
  };

  _update_search = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ search: e.target.value.trim() });
  };

  _notification = () => {
    if (this.state.loading) {
      return this._loading();
    }

    if (this.state.nodes.length === 0) {
      return this._not_found();
    }
  };

  _loading = () => {
    return (
      <div>
        <Spinner animation="border" role="status" size="sm" />
        <span> Espere por favor, cargando ...</span>
      </div>
    );
  };

  _not_found = () => {
    return (
      <div>
        <span> No hay resultados para la búsqueda... {this.state.msg}</span>
      </div>
    );
  };

  _add_node = () => {
    this.setState({ loading: true });
    let lcl_nodes = this.state.nodes;
    lcl_nodes.unshift(new_node());
    this.setState({ nodes: lcl_nodes, filter_nodes: lcl_nodes });
    this.setState({ loading: false });
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
      <Styled
        styles={[styles, bootstrap, DropZone, Progress, Upload, iconStyles]}
        scoped={true}
      >
        <div className="page-content">
          <Form.Group as={Row} className="sc-search">
            <Form.Label column sm="2" className="sc-btn-search">
              <Button
                variant="outline-dark"
                onClick={this._search_nodes_now}
                disabled={this.state.loading}
                className="btn-search"
              >
                Actualizar
              </Button>
            </Form.Label>
            <Col sm="8" className="sc-search-input">
              <Form.Control
                type="text"
                onBlur={this._update_search}
                onChange={this._filter}
                placeholder="Nodo a buscar"
              />
            </Col>
            <Button
              variant="secondary"
              className="btn-add-node"
              disabled={this.state.loading}
              onClick={this._add_node}
            >
              <FontAwesomeIcon inverse icon={faPlusCircle} size="lg" />
            </Button>
            <div>
              Por favor guarde los cambios antes de subir un archivo de
              configuración
            </div>
            <div style={{ marginLeft: "15px" }}>{this._notification()}</div>
          </Form.Group>
          <div className="div-cards">
            {this.state.loading || this.state.nodes.length === 0 ? (
              <div></div>
            ) : (
              <NodePanelV2 nodes={this.state.filter_nodes} />
            )}
          </div>
        </div>
      </Styled>
    );
  }
}

export default NodeManagementV2;
