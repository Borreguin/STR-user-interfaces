import React, { Component } from "react";
// For diagrams:
import createEngine, {
  DiagramModel,
  DefaultLinkModel,
  DiagramEngine,
} from "@projectstorm/react-diagrams";
import { CanvasWidget } from "@projectstorm/react-canvas-core";
import { TrayWidget } from "./NodeModels/DragAndDropWidget/TrayWidget";
import { TrayItemWidget } from "./NodeModels/DragAndDropWidget/TrayItemWidget";
import "../ModelingComponents/NodeModels/DragAndDropWidget/styles.css";
import * as _ from "lodash";
import { Button } from "react-bootstrap";
import { CompRootModel } from "./NodeModels/CompRoot/CompRootModel";
import { ComponentLeafModel } from "./NodeModels/ComponentLeaf/ComponentLeafModel";
import { CompRootFactory } from "./NodeModels/CompRoot/CompRootFactory";
import { AverageNodeModel } from "./NodeModels/AverageNode/AverageNodeModel";
import { WeightedNodeModel } from "./NodeModels/WeightedNode/WeightedNodeModel";
import { ComponentLeafFactory } from "./NodeModels/ComponentLeaf/ComponentLeafFactory";
import { AverageNodeFactory } from "./NodeModels/AverageNode/AverageNodeFactory";
import { WeightedNodeFactory } from "./NodeModels/WeightedNode/WeightedNodeFactory";
import { comp_root, leaf_component, menu, submenu } from "../../types";
import { DefaultState } from "../DefaultState";
import { StyledCanvasWidget } from "../helpers/StyledCanvasWidget";
import { SCT_API_URL } from "../../../../Constantes";

type BlockLeafGridProps = {
  menu: menu;
  handle_messages: Function;
  handle_reload: Function;
};

type WeightedConnection = {
  public_id: string;
  weight: string;
};

/* 
  Esta grid permite el manejo de bloques leafs.
  Se transforma a las siguientes estructuras de datos:
    From:
    type static_menu = {
        parent_id: string,
        name: string,
        public_id: string,
        icon?: IconDefinition,
        blocks?: Array<block>
        object: Object,
    }
    type block = {
        name: string,
        public_id: string,
        object: Object,
    }
        
    To:
    type Node = {
        name: string;
        type: string;
        editado: boolean;
        public_id: string;
        parent_id?: string;
        posx: number;
        posy: number;
        parallel_connections: Array<Node>;
        serial_connection: Node | undefined;
    };
*/

class ComponentRootGrid extends Component<BlockLeafGridProps> {
  state: {
    engine: DiagramEngine;
    model: DiagramModel;
  };

  engine: DiagramEngine;
  model: DiagramModel;
  last_props: BlockLeafGridProps;
  parent_id: string;

  constructor(props) {
    super(props);
    this.engine = null;
    this.model = null;
    this.last_props = _.cloneDeep(props);
    this.parent_id = "";
    this.state = {
      engine: null,
      model: null,
    };
  }

  componentDidMount = () => {
    // inicializando el componente con los nodos correspondientes
    const resp = this._init_graph();
    this.setState({ engine: resp.engine, model: resp.model });
  };

  // Permite actualizar el grid cada vez que recibe un cambio desde las propiedades
  // Esto ocurre cuando se añade un bloque en el menú lateral
  componentWillReceiveProps = (newProps: BlockLeafGridProps) => {
    let submenu_change =
      this.props.menu.submenu.length !== this.last_props.menu.submenu.length;
    let name_submenu_change = this.props.menu.name !== newProps.menu.name;
    console.log("ComponentRootGrid componentWillReceiveProps", submenu_change, name_submenu_change);
    // si hay cambio de nombre o cambio en el submenu
    if (name_submenu_change || submenu_change) {
      // limpiar el modelo antes de iniciar nuevamente
      let model = this.state.model;
      let engine = this.state.engine;
      for (const node of model.getNodes()) {
        model.removeNode(node);
      }
      for (const link of model.getLinks()) {
        model.removeLink(link);
      }
      this.engine = engine;
      this.model = model;
      engine.setModel(model);
      this.setState({ engine: engine, model: model });
    }
  };

  componentDidUpdate = (prevProps) => {
    let submenu_change =
      this.props.menu.submenu.length !== this.last_props.menu.submenu.length;
    let name_submenu_change =
      prevProps !== undefined &&
      this.props.menu.name !== prevProps.menu.name;
      console.log("ComponentRootGrid componentDidUpdate", submenu_change, name_submenu_change);
   
    if (name_submenu_change || submenu_change) {
      const resp = this._init_graph();
      let engine = this.state.engine;
      engine.setModel(resp.model);
      this.engine = resp.engine;
      this.model = resp.model;
      this.last_props = _.cloneDeep(this.props);
      this.setState({ engine: engine, model: resp.model });
    }
  };

  update_nodes_from_changes = (new_blocks: Array<leaf_component>) => {
    // actualizando en el grid solamente aquellos elementos
    // que no están presentes en el grid:
    let engine = this.state.engine;
    let nodes = engine.getModel().getNodes();

    if (nodes.length <= new_blocks.length) {
      for (const block of new_blocks) {
        let found = false;
        for (const node of nodes) {
          if (block.public_id === node["data"]["public_id"]) {
            found = true;
            break;
          }
        }
        console.log("check block", block);
        if (!found && block.document === "ComponenteLeaf") {
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
          let node = new ComponentLeafModel({
            node: data,
            handle_msg: this._handle_messages,
            handle_changes: this._handle_changes,
          });
          console.log("creando", node);
          engine.getModel().addNode(node);
        }
      }
    } else {
      for (const node of nodes) {
        let found = false;
        for (const block of new_blocks) {
          if (block.public_id === node["data"]["public_id"]) {
            found = true;
            break;
          }
        }
        if (!found && node.getType() === "ComponenteLeaf") {
          // Se ha eliminado este nodo:
          console.log("eliminando..", node.getType());
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

  // elemento root del grid:
  create_root_component = () => {
    var componentRoot = this.props.menu.object as comp_root;
    // Estructura determinada para node root del grid:
    let Root = {
      name: componentRoot.name,
      type: componentRoot.document,
      editado: false,
      public_id: componentRoot.public_id,
      parent_id: componentRoot.public_id,
      posx: componentRoot.position_x_y[0],
      posy: componentRoot.position_x_y[1],
    };
    return new CompRootModel({
      root: Root,
      handle_msg: this._handle_messages,
      handle_changes: this._handle_changes,
    });
  };

  create_root_link = () => {
    // Creación de link root, usando información del bloque leaf (como root node)
    var componentRoot = this.props.menu.object as comp_root;
    //vvar root_component = bloqueleaf.comp_root;
    // var root_data = this.props.menu.object.comp_root;
    if (
      componentRoot.topology &&
      componentRoot.topology["ROOT"] !== undefined
    ) {
      let root_node = this.model.getNode(
        componentRoot.public_id
      ) as CompRootModel;
      let node_id = componentRoot.topology["ROOT"][0];
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
    let componentRoot = menu.object as comp_root;
    // var root_component = bloqueleaf.comp_root;
    if (componentRoot === null) {
      return nodes;
    }
    componentRoot.leafs.forEach((leaf) => {
      let data = {
        name: leaf.name,
        editado: false,
        public_id: leaf.public_id,
        parent_id: leaf.parent_id,
        posx: leaf.position_x_y[0],
        posy: leaf.position_x_y[1],
      };

      var node = null;
      switch (leaf.document) {
        case "ComponenteLeaf":
          data["parallel_connections"] = [];
          node = new ComponentLeafModel({
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
    let componentRoot = menu.object as comp_root;
    componentRoot.leafs.forEach((leaf) => {
      // console.log("leaf", leaf);
      let raw_node = this.model.getNode(leaf.public_id);
      // console.log(raw_node.getType());
      switch (raw_node.getType()) {
        case "ComponenteLeaf":
          let block_node = raw_node as ComponentLeafModel;
          next_topology = this.connect_serie_if_exist(
            leaf.topology,
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
            leaf.topology,
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
            leaf.topology,
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

  create_selected_node = (type: string, parent_id: string) => {
    // Se crea un nodo dependiendo el botón seleccionado:
    var node = null;
    let data = null;
    switch (type) {
      case "AverageNode":
        // Nodo de tipo promedio
        data = {
          name: "PROMEDIO",
          editado: false,
          public_id: _.uniqueId("AverageNode_"),
          parent_id: parent_id,
          connections: [],
          serial_connection: [],
        };
        node = new AverageNodeModel({
          node: data,
          handle_msg: this._handle_messages,
          handle_changes: this._handle_changes,
        });
        // añadiendo mínimo 2 puertos promedio:
        node.addAveragePort();
        node.addAveragePort();
        break;

      case "WeightedNode":
        data = {
          name: "PONDERADO",
          editado: false,
          public_id: _.uniqueId("WeightedNode_"),
          parent_id: parent_id,
          connections: [
            {
              public_id: _.uniqueId("WeightedPort_"),
              weight: 50,
            },
            {
              public_id: _.uniqueId("WeightedPort_"),
              weight: 50,
            },
          ],
          serial_connection: [],
        };
        node = new WeightedNodeModel({
          node: data,
          handle_msg: this._handle_messages,
          handle_changes: this._handle_changes,
        });
        // añadiendo mínimo 2 puertos ponderados:
        // node.addWeightedPort(null, 50);
        // node.addWeightedPort(null, 50);
        break;
    }
    return node;
  };

  save_all = async (e) => {
    let msg = { state: "Empezando proceso", validate: {} };
    let all_is_valid = true;
    // validar todas las topologías:
    // solve all promises:
    let nodes = this.model.getNodes();
    for (const node of nodes) {
      const check = await node.fireEvent(e, "validate");
      msg.validate[check["name"]] = check["valid"];
      all_is_valid = all_is_valid && check["valid"];
      if (!check["valid"]) {
        msg.state = `El elemento ${check["name"]} no es válido`;
      }
    }
    // si todo es válido entonces se puede proceder a
    if (all_is_valid) {
      all_is_valid = true;
      for (const node of nodes) {
        const check = await node.fireEvent(e, "save topology");
        console.log(node["data"]["name"], check);
        all_is_valid = all_is_valid && check["success"];
        if (!check["success"]) {
          msg.state = `El elemento ${node["data"]["name"]} no es válido`;
          msg["log"] = check;
        }
      }
      if (all_is_valid) {
        msg.state = "Se ha guardado de manera correcta la modelación";
      }
      this._handle_messages(msg);
    }
    this._handle_messages(msg);
    //this.reload_graph();
  };

  reload_graph = () => {
    if (this.props.handle_reload !== undefined) {
      this.get_object_from_db().then((json) => {
        let new_menu = this.create_menu_from_json(json);
        console.log("reload_block_leaf_grid", new_menu);
        this.props.handle_reload(new_menu);
      });
    }
  };

  get_object_from_db = async() => {
    // permite actualizar desde la base de datos:
    console.log(this.props.menu);
    let answer = null;
    let path = `${SCT_API_URL}/component-root/${this.props.menu.public_id}`;
    await fetch(path)
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          answer = json;
        }
        else {
          this._handle_messages({ succes: false, msg: json.msg });
        }
      })
      .catch((error) =>
        this._handle_messages({ success: false, error: "" + error })
    );
    return answer;
  }

  create_menu_from_json = (json) => {
    let rootComponent = json.componente as comp_root;
    let submenus = [];
    for (const leaf of rootComponent.leafs) {
      let submenu = {
        level: this.props.menu.level,
        document: leaf.document,
        public_id: leaf.public_id,
        parent_id: leaf.parent_id,
        name: leaf.name,
        object: leaf
      } as submenu;
      submenus.push(submenu);
    }
    let new_menu = {
      level: this.props.menu.level,
      document: rootComponent.document,
      public_id: rootComponent.public_id,
      parent_id: rootComponent.parent_id,
      name: rootComponent.name,
      object: rootComponent,
      submenu: submenus
    } as menu;
    return new_menu;
  }

  _init_graph = () => {
    //1) setup the diagram engine
    // IMPORTANTE: No se registra la manera por defecto de eliminar elementos
    let engine = createEngine({ registerDefaultDeleteItemsAction: false });
    let model = new DiagramModel();

    // 1.a) Register factories: Puertos y Nodos
    engine.getNodeFactories().registerFactory(new CompRootFactory());
    engine.getNodeFactories().registerFactory(new ComponentLeafFactory());
    engine.getNodeFactories().registerFactory(new AverageNodeFactory());
    engine.getNodeFactories().registerFactory(new WeightedNodeFactory());

    // Empezando la población de grid:
    let componentRoot = this.props.menu.object as comp_root;
    if (componentRoot === null) {
      this.model = model;
      this.engine = engine;
      engine.setModel(this.model);
      return { model: model, engine: engine };
    }
    // Variables generales:
    this.parent_id = componentRoot.public_id;
    // console.log("voy a trabajar con esto:", this.props.menu)

    // Añadir el bloque root (inicio de operaciones):
    model.addNode(this.create_root_component());

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

  render() {
    //const resp = this._init_graph();
    //console.log(this.state.engine);
    //let model = resp.model;
    //let engine = resp.engine;

    return (
      <>
        <TrayWidget>
          <TrayItemWidget model={{ type: "AverageNode" }} name="Promedio" />
          <TrayItemWidget
            model={{ type: "WeightedNode" }}
            name="Promedio ponderado"
          />
          <Button
            style={{ float: "right" }}
            variant="outline-warning"
            onClick={this.save_all}
          >
            Guardar
          </Button>
          <Button
            style={{ float: "right" }}
            variant="outline-success"
            onClick={this.reload_graph}
          >
            Actualizar
          </Button>
        </TrayWidget>
        <div
          className="Layer"
          onDrop={(event) => {
            var data = JSON.parse(
              event.dataTransfer.getData("storm-diagram-node")
            );
            console.log("check me this", data, this.props.menu);
            let node = this.create_selected_node(data.type, this.parent_id);
            var point = this.state.engine.getRelativeMousePoint(event);
            node.setPosition(point);
            let model = this.state.model;
            let engine = this.state.engine;
            model.addNode(node);
            engine.setModel(model);
            // manteniendo actualizado:
            this.model = model;
            this.engine = engine;
            this.setState({ engine: engine, model: model });
          }}
          onDragOver={(event) => {
            event.preventDefault();
          }}
        >
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

export default ComponentRootGrid;
