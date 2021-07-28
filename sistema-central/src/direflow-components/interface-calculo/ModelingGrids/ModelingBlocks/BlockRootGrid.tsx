import React, { Component } from "react";
// For diagrams:
import createEngine, {
  DiagramModel,
  DefaultLinkModel,
  DiagramEngine,
} from "@projectstorm/react-diagrams";
import { CanvasWidget } from "@projectstorm/react-canvas-core";
import { BlockFactory } from "./NodeModels/BlockNode/BlockFactory";
import { BlockNodeModel } from "./NodeModels/BlockNode/BlockNodeModel";
import { BlockRootModel } from "./NodeModels/BlockRoot/BlockRootModel";
import { BlockRootFactory } from "./NodeModels/BlockRoot/BlockRootFactory";
import { AverageNodeFactory } from "./NodeModels/AverageNode/AverageNodeFactory";
import { AverageNodeModel } from "./NodeModels/AverageNode/AverageNodeModel";
import { WeightedNodeFactory } from "./NodeModels/WeightedNode/WeightedNodeFactory";
import { WeightedNodeModel } from "./NodeModels/WeightedNode/WeightedNodeModel";
import "./NodeModels/DragAndDropWidget/styles.css";
import * as _ from "lodash";
import { Button } from "react-bootstrap";
import { StyledCanvasWidget } from "../helpers/StyledCanvasWidget";
import { DefaultState } from "../DefaultState";
import { block, block_leaf, bloque_leaf, bloque_root, menu } from "../../types";
import { DateRange } from "react-date-range";
import { es } from "date-fns/locale";
import {
  get_fisrt_dates_of_last_month,
  to_range,
  to_yyyy_mm_dd_hh_mm_ss,
} from "../../common_functions";
import { SCT_API_URL } from "../../../../Constantes";

type BlockRootGridProps = {
  menu: menu;
  handle_messages: Function;
  handle_reload: Function;
  model_id: string;
};

type WeightedConnection = {
  public_id: string;
  weight: string;
};

type Range = {
  startDate: Date;
  endDate: Date;
  key: string;
};


class BlockRootGrid extends Component<BlockRootGridProps> {
  state: {
    engine: DiagramEngine;
    model: DiagramModel;
    show_date: boolean;
    ini_date: Date;
    ini_date_str: string;
    end_date: Date;
    end_date_str: string;
    range: Array<Range>;
  };

  engine: DiagramEngine;
  model: DiagramModel;
  last_props: any;
  parent_id: string;

  constructor(props) {
    super(props);
    this.engine = null;
    this.model = null;
    this.last_props = _.cloneDeep(props);
    this.parent_id = "";
    let ini_period_str = localStorage.getItem("$ini_period");
    let ini_period = new Date(ini_period_str);
    let end_period_str = localStorage.getItem("$end_period");
    let end_period = new Date(end_period_str);
    let period = null;

    if (ini_period_str === null || end_period_str === null) {
      period = get_fisrt_dates_of_last_month();
    } else {
      period = {first_day_month: ini_period, last_day_month: end_period}
    }
    
    let range = {
      startDate: period.first_day_month,
      endDate: period.last_day_month,
      key: "selection",
    };
    this.state = {
      engine: null,
      model: null,
      show_date: false,
      ini_date: period.first_day_month,
      ini_date_str: to_yyyy_mm_dd_hh_mm_ss(period.first_day_month),
      end_date: period.last_day_month,
      end_date_str: to_yyyy_mm_dd_hh_mm_ss(period.last_day_month),
      range: [range],
    };
  }

  componentDidMount = () => {
    // inicializando el componente con los nodos correspondientes
    const resp = this._init_graph();
    this.setState({ engine: resp.engine, model: resp.model });
  };

  // Permite actualizar el grid cada vez que recibe un cambio desde las propiedades
  // Esto ocurre cuando se añade un bloque en el menú lateral
  componentWillReceiveProps = (newProps) => {
    if (newProps.menu.submenu.length !== this.last_props.menu.submenu.length) {
      this.last_props = _.cloneDeep(newProps);
      this.update_nodes_from_changes(newProps.menu.submenu);
    }
  };

  update_nodes_from_changes = (new_submenu: Array<block>) => {
    // actualizando en el grid solamente aquellos elementos
    // que no están presentes en el grid:
    let engine = this.state.engine;
    let nodes = engine.getModel().getNodes();
    if (nodes.length <= new_submenu.length) {
      for (const block of new_submenu) {
        let found = false;
        for (const node of nodes) {
          if (block.public_id === node["data"]["public_id"]) {
            found = true;
            break;
          }
        }
        // console.log(block.object.document);
        if (!found && block.object.document === "BloqueLeaf") {
          // Se asume que solamente serán de tipo BlockLeaf:
          let data = {
            name: block.name,
            editado: false,
            public_id: block.public_id,
            parent_id: this.parent_id,
            posx: 300,
            posy: 300,
            parallel_connections: [],
          };
          let node = new BlockNodeModel({
            node: data,
            handle_msg: this._handle_messages,
            handle_changes: this._handle_changes,
          });
          engine.getModel().addNode(node);
        }
      }
    } else {
      for (const node of nodes) {
        let found = false;
        for (const block of new_submenu) {
          if (block.public_id === node["data"]["public_id"]) {
            found = true;
            break;
          }
        }
        if (!found && node.getType() === "BloqueLeaf") {
          // Se ha eliminado este nodo:
          let ports = node.getPorts();
          for (var p in ports) {
            let port = ports[p];
            let links = port.getLinks();
            for (var id_l in links) {
              let link = links[id_l];
              node.getLink(id_l).remove();
              engine.getModel().removeLink(link);
            }
          }
          engine.getModel().removeNode(node);
        }
      }
    }

    this.setState({ engine: engine });
  };

  // handle messages from internal elements:
  _handle_messages = (msg: Object) => {
    if (this.props.handle_messages !== undefined) {
      this.props.handle_messages(msg);
    }
  };

  // handle changes in nodes:
  _handle_changes = (obj: Object) => {
    if (obj !== null && obj["node"] !== undefined) {
      this.model.addNode(obj["node"]);
    }
  };

  create_root_block = () => {
    var root_data = this.props.menu.object as bloque_root;
    // Estructura determinada para bloque Root:
    let Root = {
      name: root_data.name,
      type: root_data.document,
      editado: false,
      public_id: root_data.public_id,
      parent_id: null,
      posx: root_data.position_x_y[0],
      posy: root_data.position_x_y[1],
    };
    return new BlockRootModel({
      root: Root,
      handle_msg: this._handle_messages,
      handle_changes: this._handle_changes,
    });
  };

  create_root_link = () => {
    // Creación de link root
    var root_data = this.props.menu.object as bloque_root;

    if (root_data.topology && root_data.topology["ROOT"] !== undefined) {
      let root_node = this.model.getNode(root_data.public_id) as BlockRootModel;
      let node_id = root_data.topology["ROOT"][0];
      let node_to_connect = this.model.getNode(node_id);
      if (node_to_connect === undefined) {
        return;
      }
      let source_port = root_node.get_root_port();
      let target_port = node_to_connect.getPort("InPut");
      let link = new DefaultLinkModel();
      link.setSourcePort(source_port);
      link.setTargetPort(target_port);
      this.model.addLink(link);
    }
  };

  // creando nodos de acuerdo a cada tipo.
  create_nodes = () => {
    const { menu } = this.props;
    let nodes = [];
    menu.submenu.forEach((submenu) => {
      let bloqueleaf = submenu.object as bloque_leaf;
      let data = {
        name: bloqueleaf.name,
        editado: false,
        public_id: bloqueleaf.public_id,
        parent_id: bloqueleaf.parent_id,
        posx: bloqueleaf.position_x_y[0],
        posy: bloqueleaf.position_x_y[1],
      };

      var node = null;
      switch (bloqueleaf.document) {
        case "BloqueLeaf":
          data["parallel_connections"] = [];
          node = new BlockNodeModel({
            node: data,
            handle_msg: this._handle_messages,
            handle_changes: this._handle_changes,
          });
          break;
        case "AverageNode":
          data["connections"] = [];
          node = new AverageNodeModel({
            node: data,
            handle_msg: this._handle_messages,
            handle_changes: this._handle_changes,
          });
          break;
        case "WeightedNode":
          data["connections"] = [];
          node = new WeightedNodeModel({
            node: data,
            handle_msg: this._handle_messages,
            handle_changes: this._handle_changes,
          });
          break;
      }
      if (node !== null) {
        nodes.push(node);
      }
    });
    return nodes;
  };

  connect_serie_if_exist = (topology: Object, serie_port) => {
    let next_topology = null;
    const operation = "SERIE";
    if (topology.hasOwnProperty(operation)) {
      // Caso serie simple, se conecta con el primer miembro de la lista
      let node = null;
      if (topology[operation].length == 1) {
        node = this.model.getNode(topology[operation][0]);
      }
      // Caso serie avanzado, se conecta con el segundo miembro de la lista
      else if (topology[operation].length == 2) {
        next_topology = topology[operation][0];
        node = this.model.getNode(topology[operation][1]);
      }
      if (node === undefined) {
        return next_topology;
      }
      // creando el link de conexión:
      let target_port = node.getPort("InPut");
      let link = new DefaultLinkModel();
      link.setSourcePort(serie_port);
      link.setTargetPort(target_port);
      this.model.addLink(link);
      return next_topology;
    }
    return topology;
  };

  create_node_links = () => {
    const { menu } = this.props;
    let next_topology = null;
    menu.submenu.forEach((submenu) => {
      let bloqueLeaf = submenu.object as block_leaf;
      let raw_node = this.model.getNode(bloqueLeaf.public_id);
      // console.log(raw_node.getType());
      switch (raw_node.getType()) {
        case "BloqueLeaf":
          let block_node = raw_node as BlockNodeModel;
          next_topology = this.connect_serie_if_exist(
            bloqueLeaf.topology,
            block_node.get_serie_port()
          );
          // si existe una topology que deserializar:
          if (next_topology) {
            const operation = "PARALELO";
            // añadiendo puertos paralelos si existen en la topología
            if (next_topology.hasOwnProperty(operation)) {
              let ids_operandos = next_topology[operation] as Array<string>;
              ids_operandos.forEach((id_operando) => {
                let node_to_connect = this.model.getNode(id_operando);
                if (node_to_connect !== undefined) {
                  let source_port = block_node.add_parallel_port(
                    node_to_connect["data"]["name"]
                  );
                  let target_port = node_to_connect.getPort("InPut");
                  let link = new DefaultLinkModel();
                  link.setSourcePort(source_port);
                  link.setTargetPort(target_port);
                  this.model.addLink(link);
                }
              });
            }
          }
          break;
        case "AverageNode":
          let average_node = raw_node as AverageNodeModel;
          next_topology = this.connect_serie_if_exist(
            bloqueLeaf.topology,
            average_node.get_serie_port()
          );
          // si existe una topology que deserializar:
          if (next_topology) {
            const operation = "PROMEDIO";
            // añadiendo puertos paralelos si existen en la topología
            if (next_topology.hasOwnProperty(operation)) {
              let ids_operandos = next_topology[operation] as Array<string>;
              ids_operandos.forEach((id_operando) => {
                let node_to_connect = this.model.getNode(id_operando);
                if (node_to_connect !== undefined) {
                  let source_port = average_node.add_average_port();
                  let target_port = node_to_connect.getPort("InPut");
                  let link = new DefaultLinkModel();
                  link.setSourcePort(source_port);
                  link.setTargetPort(target_port);
                  this.model.addLink(link);
                }
              });
            }
          }
          break;

        case "WeightedNode":
          let weighted_node = raw_node as WeightedNodeModel;
          // identificar si existe topología en serie
          next_topology = this.connect_serie_if_exist(
            bloqueLeaf.topology,
            weighted_node.get_serie_port()
          );
          // si existe una topology que deserializar:
          if (next_topology) {
            const operation = "PONDERADO";
            // añadiendo puertos paralelos si existen en la topología
            if (next_topology.hasOwnProperty(operation)) {
              let ids_operandos = next_topology[
                operation
              ] as Array<WeightedConnection>;
              ids_operandos.forEach((connection) => {
                let node_to_connect = this.model.getNode(connection.public_id);
                if (node_to_connect !== undefined) {
                  let source_port = weighted_node.add_weighted_port(
                    connection.public_id,
                    parseFloat(connection.weight)
                  );
                  let target_port = node_to_connect.getPort("InPut");
                  let link = new DefaultLinkModel();
                  link.setSourcePort(source_port);
                  link.setTargetPort(target_port);
                  this.model.addLink(link);
                }
              });
            }
          }
          break;
      }
    });
  };

  reload_graph = () => {
    if (this.props.handle_reload !== undefined) {
      this.props.handle_reload(this.props.menu);
    }
  };

  calculate_all = () => {
    let path = `${SCT_API_URL}/calculation/execute/${this.props.model_id}/${to_range(this.state.ini_date, this.state.end_date)}`;
    fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((json) => {
        this._handle_messages({ log: json });
      })
      .catch(console.log);
  }

  _init_graph = () => {
    //1) setup the diagram engine
    // IMPORTANTE: No se registra la manera por defecto de eliminar elementos
    let engine = createEngine({ registerDefaultDeleteItemsAction: false });
    let model = new DiagramModel();

    // 1.a) Register factories: Puertos y Nodos
    engine.getNodeFactories().registerFactory(new BlockFactory());
    engine.getNodeFactories().registerFactory(new BlockRootFactory());
    engine.getNodeFactories().registerFactory(new AverageNodeFactory());
    engine.getNodeFactories().registerFactory(new WeightedNodeFactory());

    // Empezando la población de grid:

    // Variables generales:
    let parent_id = this.props.menu.object["public_id"];
    this.parent_id = parent_id;

    // Añadir el bloque root (inicio de operaciones):
    model.addNode(this.create_root_block());

    // Añadir nodos de acuerdo a cada tipo
    this.create_nodes().forEach((node) => model.addNode(node));

    // lets update models and engine:
    this.model = model;
    this.engine = engine;

    // Añadir links
    // Link root
    this.create_root_link();

    // Link root de nodos:
    this.create_node_links();

    engine.setModel(this.model);
    // Use this custom "DefaultState" instead of the actual default state we get with the engine
    engine.getStateMachine().pushState(new DefaultState());

    // el diagrama ha quedado actualizado:
    this.engine = engine;
    this.model = model;
    // this.setState({ engine: engine, model: model });
    return { model: model, engine: engine };
  };

  handleSelect = (range) => {
    this.setState({
      range: [range.selection],
      ini_date: range.selection.startDate,
      ini_date_str: to_yyyy_mm_dd_hh_mm_ss(range.selection.startDate),
      end_date: range.selection.endDate,
      end_date_str: to_yyyy_mm_dd_hh_mm_ss(range.selection.endDate),
    });
    localStorage.setItem("$ini_period", "" + range.selection.startDate);
    localStorage.setItem("$end_period", "" + range.selection.endDate);
  };

  onChangeDate = (e, id) => {
    let dt = Date.parse(e.target.value);
    let isIniDate = id === "ini_date";
    let isEndDate = id === "end_date";
    if (!isNaN(dt)) {
      if (isIniDate) {
        this.setState({ ini_date: new Date(dt) });
        localStorage.setItem("$ini_period", "" + new Date(dt));
      }
      if (isEndDate) {
        this.setState({ end_date: new Date(dt) });
        localStorage.setItem("$end_period", "" + new Date(dt));
      }
    }
    if (isIniDate) {
      this.setState({ ini_date_str: e.target.value });
    }
    if (isEndDate) {
      this.setState({ end_date_str: e.target.value });
    }
  };

  render() {

    return (
      <>
        <div className="BarWidget">
          <Button
            variant="outline-info"
            onClick={() => {
              this.setState({ show_date: !this.state.show_date });
            }}
          >
            {!this.state.show_date ? "Mostrar calendario" : "Aceptar selección"}
          </Button>
          {" "}
          <input
            className="date-input"
            value={this.state.ini_date_str}
            onChange={(e) => this.onChangeDate(e, "ini_date")}
          />{" "}
          <input
            className="date-input"
            value={this.state.end_date_str}
            onChange={(e) => this.onChangeDate(e, "end_date")}
          />
          <Button
            style={{ float: "right" }}
            variant="outline-warning"
            onClick={this.calculate_all}
          >
            Calcular
          </Button>

          <Button
            style={{ float: "right" }}
            variant="outline-success"
            onClick={this.reload_graph}
          >
            Actualizar
          </Button>
        </div>
        <div
            className={
              this.state.show_date ? "date-range-show-fixed" : "date-range-no-show"
            }
          >
            <DateRange
              locale={es}
              ranges={this.state.range}
              showMonthAndYearPickers={true}
              dateDisplayFormat={"yyyy MMM d"}
              onChange={this.handleSelect}
              months={1}
              direction="horizontal"
              fixedHeight={true}
              column="true"
            />
          </div>
        <div className="Layer">
          {this.state.engine === null ? (
            <></>
          ) : (
            <StyledCanvasWidget className="grid">
              <CanvasWidget engine={this.state.engine} />
            </StyledCanvasWidget>
          )}
        </div>
      </>
    );
  }
}

export default BlockRootGrid;
