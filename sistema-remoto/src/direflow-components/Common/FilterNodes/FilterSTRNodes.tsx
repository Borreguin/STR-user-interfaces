import React, { Component } from "react";
import { Form, Col, Spinner, Button } from "react-bootstrap";
import ReactTooltip from "react-tooltip";
import { SRM_API_URL } from "../../../Constantes";
import { Entity, Node } from "../GeneralTypes";


export interface SRConsigProps {
  onChange: Function;
}

export interface SRConsigState {
  loading: boolean;
  nodes: Array<Node>;
  options: Object;
  msg: string;
}

class FilterSTRNodes extends Component<SRConsigProps, SRConsigState> {
  selected: {};
  selected_id: {};
  utrs: any[];
  url: string;
  entidades: any[];
  selected_node: Node | undefined;
  selected_entity: Entity | undefined;

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      nodes: [],
      options: {},
      msg: "Espere por favor, cargando... "
    };
    this.selected = {};
    this.entidades = [];
    this.utrs = [];
    this.url = "";
    this.selected_node = undefined;
    this.selected_entity = undefined;
  }

  _handle_filter_change = () => {
    let selected_id = {};
    selected_id["nodo"] = undefined;
    selected_id["entidad"] = undefined;
    selected_id["utr"] = undefined;

    for (var idx in this.state.nodes) {
      let node = this.state.nodes[idx];
      if (
        node.tipo === this.selected["nodo_tipo"] &&
        node.nombre === this.selected["nodo_nombre"]
      ) {
        selected_id["nodo"] = node.id_node;
        for (var idy in node.entidades) {
          let entidad = node.entidades[idy];
          if (
            entidad.entidad_nombre === this.selected["entidad_nombre"] &&
            entidad.entidad_tipo === this.selected["entidad_tipo"]
          ) {
            selected_id["entidad"] = entidad.id_entidad;
          }
        }
      }
    }
    for (var idz in this.utrs) {
      let utr = this.utrs[idz];
      if (
        utr.utr_tipo === this.selected["utr_tipo"] &&
        utr.utr_nombre === this.selected["utr_nombre"]
      ) {
        selected_id["utr"] = utr.utr_code;
      }
    }
    this.props.onChange(this.selected, selected_id);
  };

  componentDidMount = () => {
    this.setState({ loading: true });
    this._update_filter();
    this.setState({ loading: false });
  };

  _update_filter = async () => {
    let path = SRM_API_URL + "/admin-sRemoto/nodos/";
    await fetch(path)
      .then((res) => res.json())
      .then((json) => {
        if (!json.success) {
          // si existe errores:
          this.setState({ nodes: [], loading: false });
        } else {
          // si los nodos están ok:
          let nodes = json.nodos;
          nodes.sort((a, b) => (a.nombre > b.nombre ? 1 : -1));
          this.setState({ nodes: nodes });
          this.selected = {};
          this.selected_node = undefined;
          this.selected_entity = undefined;
        }
      })
      .catch((e) => {
        this.setState({ loading: true, msg: "Problema de conexión con la API-RMT" });
        console.log(e);
      });
    this._node_types();
    this._handle_filter_change();
  };

  _filter_options = (
    array: any[], // lista a filtrar
    field: string, // atributo por el cual se realizará la lista
    if_field = undefined, // filtrado condicional (campo a filtrar)
    if_value = undefined // filtrado condicional (valor a filtrar)
  ) => {
    let options = [];
    let check = [];
    array.forEach((item, ix) => {
      if (!check.includes(item[field])) {
        if (if_field === undefined || if_value === undefined) {
          options.push(<option key={ix}>{item[field]}</option>);
          check.push(item[field]);
        } else if (item[if_field] === if_value) {
          options.push(<option key={ix}>{item[field]}</option>);
          check.push(item[field]);
        }
      }
    });
    return options;
  };

  // Define las opciones posibles de tipos de nodos:
  _node_types = () => {
    let options = this.state.options;
    let selected = this.selected;
    // Si existen nodos a presentar; seleccionar el primer tipo de nodo:
    // Selección por defecto:
    if (this.state.nodes.length > 0) {
      if (selected["nodo_tipo"] === undefined) {
        selected["nodo_tipo"] = this.state.nodes[0].tipo;
        this.selected = selected;
      }
      // crear las opciones para el ComboBox
      options["nodo_tipo"] = this._filter_options(this.state.nodes, "tipo");
    } else {
      // Si no existen nodos a mostrar:
      selected["nodo_tipo"] = undefined;
      options["nodo_tipo"] = [<option>No existen nodos a seleccionar</option>];
      options["entidad_tipo"] = [
        <option>No existen entidades a seleccionar</option>,
      ];
      options["utr_tipo"] = [<option>No existen utrs a seleccionar</option>];
      this._utr_type();
      // Se finaliza la exploración de datos:
      return;
    }
    // Actualizar las opciones de nodo tipo si existen nodos a desplegar
    this.setState({ options: options });
    // se prosigue con las opciones de nodos de nombre:
    this._node_names();
  };

  // Define las opciones de nombres de los nodos:
  _node_names = () => {
    if (this.state.nodes.length === 0) {
      this._utr_names();
      // Finaliza la exploración
      return;
    }
    // Crear las opciones de nombres de Nodos:
    let options = this.state.options;
    options["nodo_nombre"] = this._filter_options(
      this.state.nodes, // lista a filtrar
      "nombre", // campo para formar la lista
      "tipo", // Si el campo "tipo"
      this.selected["nodo_tipo"] // es igual a "selected['nodo_tipo']"
    );
    // Actualizar el estado de las opciones nombres de nodos:
    if (options["nodo_nombre"].length > 0) {
      // Existe algo que seleccionar:
      // Selección por defecto primer miembro de la lista
      this.selected["nodo_nombre"] = options["nodo_nombre"][0].props.children;
      //this._update_node();
    } else {
      // No hay algo que seleccionar
      this.selected["nodo_nombre"] = undefined;
      return;
    }
    // Si hay algo por seleccionar pasar a siguiente filtro (tipo de entidades)
    this.setState({ options: options });
    this._entity_types();
  };

  // Define las opciones de tipos de entidades que se pueden elegir:
  _entity_types = () => {
    let options = this.state.options;
    // valores iniciales:
    this.selected["entidad_tipo"] = undefined;
    this.selected["entidad_nombre"] = undefined;

    if (this.state.nodes.length === 0) {
      this.utrs = [];
      this._utr_type();
      // Finaliza la exploración
      return;
    }
    // Filtrar mediante el nodo seleccionado:
    let nodes = this.state.nodes;
    for (var idx in nodes) {
      let node = nodes[idx];
      if (
        node.tipo === this.selected["nodo_tipo"] &&
        node.nombre === this.selected["nodo_nombre"]
      ) {
        // Este es el nodo seleccionado:
        this.selected_node = node;

        // Creando lista de entidad tipo:
        options["entidad_tipo"] = this._filter_options(
          node.entidades, // lista de entidades a filtrar
          "entidad_tipo" // crear lista de tipos de entidades
        );

        // Verificar si existen opciones de selección:
        if (options["entidad_tipo"].length > 0) {
          // seleccionar el primer elemento por defecto
          this.selected["entidad_tipo"] =
            options["entidad_tipo"][0].props.children;
        } else {
          // No hay elementos que seleccionar:
          options["entidad_tipo"] = [
            <option key={0}>No existen entidades a seleccionar </option>,
          ];
          options["entidad_nombre"] = [<option key={0}> </option>];
          this.utrs = [];
          this._utr_type();
          // finaliza la exploración de filtrado
          return;
        }
      }
    }
    // Existen opciones que filtrar, presentar las opciones de nombres de entidades:
    this.setState({ options: options });
    this._entity_names();
  };

  _entity_names = () => {
    let options = this.state.options;
    if (this.state.nodes.length === 0) {
      this.selected["nodo_nombre"] = undefined;
      this._utr_type();
      // finaliza la exploración
      return;
    }

    // El nodo ha sido seleccionado previamente:
    let node = this.selected_node;

    // crear la lista de opciones de nombre de entidades
    options["entidad_nombre"] = this._filter_options(
      node.entidades, // lista a filtrar
      "entidad_nombre", // campo a generar lista
      "entidad_tipo", // condicional si "entidad tipo"
      this.selected["entidad_tipo"] // es el tipo de entidad seleccionada
    );
    if (options["entidad_nombre"].length > 0) {
      this.selected["entidad_nombre"] =
        options["entidad_nombre"][0].props.children;
    } else {
      this.selected["entidad_nombre"] = undefined;
      // No se puede explorar
      return;
    }

    // existe opciones de seleccionar:
    this.setState({ options: options });
    this._utr_type();
  };

  _utr_type = () => {
    let options = this.state.options;
    // El nodo ha sido seleccionado previamente:
    let node = this.selected_node;
    if (node === undefined) { return }
    for (var idx in node.entidades) {
      let entidad = node.entidades[idx];
      if (
        entidad.entidad_tipo === this.selected["entidad_tipo"] &&
        entidad.entidad_nombre === this.selected["entidad_nombre"]
      ) {
        // Esta es la entidad seleccionada:
        this.selected_entity = entidad;
        this.utrs = entidad.utrs;
        if (this.utrs === undefined || this.utrs.length === 0) {
          // No hay UTRs que mostrar:
          options["utr_tipo"] = [
            <option key={1}>No hay UTRs a seleccionar</option>,
          ];
          options["utr_nombre"] = [];
          this.selected["utr_tipo"] = undefined;
          this.selected["utr_nombre"] = undefined;
        } else {
          options["utr_tipo"] = this._filter_options(this.utrs, "utr_tipo");

          if (options["utr_tipo"].length > 0) {
            this.selected["utr_tipo"] = options["utr_tipo"][0].props.children;
          } else {
            this.selected["utr_tipo"] = undefined;
          }
        }
      }
    }

    this.setState({ options: options });
    this._utr_names();
  };

  _utr_names = () => {
    if (this.utrs === undefined || this.utrs.length === 0) {
      return;
    }
    let options = this.state.options;
    this.utrs.sort((a, b) => (a.utr_nombre > b.utr_nombre ? 1 : -1));
    options["utr_nombre"] = this._filter_options(
      this.utrs,
      "utr_nombre",
      "utr_tipo",
      this.selected["utr_tipo"]
    );
    if (options["utr_nombre"].length > 0) {
      this.selected["utr_nombre"] = options["utr_nombre"][0].props.children;
    } else {
      this.selected["utr_nombre"] = undefined;
    }
    this.setState({ options: options });
    this._handle_filter_change();
  };

  _handle_change = (e, name) => {
    if (this.state.nodes.length === 0) return;
    let { value } = e.target;
    this.selected[name] = value;

    switch (name) {
      case "nodo_tipo":
        this._node_names();
        break;
      case "nodo_nombre":
        this._entity_types();
        break;
      case "entidad_tipo":
        this._entity_names();
        break;
      case "entidad_nombre":
        this._utr_type();
        break;
      case "utr_tipo":
        this._utr_names();
        break;
    }
    this._handle_filter_change();
  };

  render() {
    return (
      <div>
        {this.state.loading ? (
          <div>
            <br></br>
            <Spinner animation="border" role="status" size="sm" />
            <span> { this.state.msg}</span>
          </div>
        ) : (
          <Form className="tab-container">
            <Form.Row>
              <Form.Label className="update_label">
                <Button
                  data-tip={"Actualiza todos los campos"}
                  onClick={this._update_filter}
                  variant="outline-success"
                  size="sm"
                >
                  Actualizar
                </Button>
                <ReactTooltip />
              </Form.Label>
            </Form.Row>
            <Form.Label className="cons-label space">Seleccione Nodo</Form.Label>
            <Form.Row>
              <Form.Group as={Col} className="cons-col">
                <Form.Control
                  as="select"
                  size="sm"
                  value={this.selected["nodo_tipo"]}
                  onChange={(e) => this._handle_change(e, "nodo_tipo")}
                >
                  {this.state.options["nodo_tipo"] === undefined ? (
                    <option></option>
                  ) : (
                    this.state.options["nodo_tipo"]
                  )}
                </Form.Control>
              </Form.Group>
              <Form.Group as={Col} className="cons-col">
                <Form.Control
                  as="select"
                  size="sm"
                  value={this.selected["nodo_nombre"]}
                  onChange={(e) => this._handle_change(e, "nodo_nombre")}
                >
                  {this.state.options["nodo_nombre"] === undefined ? (
                    <option></option>
                  ) : (
                    this.state.options["nodo_nombre"]
                  )}
                </Form.Control>
              </Form.Group>
            </Form.Row>
            <Form.Label className="cons-label">Seleccione Entidad</Form.Label>
            <Form.Row>
              <Form.Group as={Col} className="cons-col">
                <Form.Control
                  as="select"
                  size="sm"
                  value={this.selected["entidad_tipo"]}
                  onChange={(e) => this._handle_change(e, "entidad_tipo")}
                >
                  {this.state.options["entidad_tipo"] === undefined ? (
                    <option></option>
                  ) : (
                    this.state.options["entidad_tipo"]
                  )}
                </Form.Control>
              </Form.Group>
              <Form.Group as={Col} className="cons-col">
                <Form.Control
                  as="select"
                  size="sm"
                  value={this.selected["entidad_nombre"]}
                  onChange={(e) => this._handle_change(e, "entidad_nombre")}
                >
                  {this.state.options["entidad_nombre"] === undefined ? (
                    <option></option>
                  ) : (
                    this.state.options["entidad_nombre"]
                  )}
                </Form.Control>
              </Form.Group>
            </Form.Row>

            <Form.Label className="cons-label">Seleccione UTR</Form.Label>

            <Form.Row>
              <Form.Group as={Col}>
                <Form.Control
                  as="select"
                  size="sm"
                  value={this.selected["utr_tipo"]}
                  onChange={(e) => this._handle_change(e, "utr_tipo")}
                >
                  {this.state.options["utr_tipo"] === undefined ? (
                    <option></option>
                  ) : (
                    this.state.options["utr_tipo"]
                  )}
                </Form.Control>
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Control
                  as="select"
                  size="sm"
                  value={this.selected["utr_nombre"]}
                  onChange={(e) => this._handle_change(e, "utr_nombre")}
                >
                  {this.state.options["utr_nombre"] === undefined ? (
                    <option></option>
                  ) : (
                    this.state.options["utr_nombre"]
                  )}
                </Form.Control>
              </Form.Group>
            </Form.Row>
          </Form>
        )}
      </div>
    );
  }
}

export default FilterSTRNodes;
