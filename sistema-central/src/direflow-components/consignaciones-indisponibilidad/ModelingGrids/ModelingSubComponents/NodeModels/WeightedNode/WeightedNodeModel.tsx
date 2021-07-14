import { NodeModel, NodeModelGenerics } from "@projectstorm/react-diagrams";
import { SerialOutPortModel } from "./SerialOutputPort";
import * as _ from "lodash";
import { InPortModel } from "./InPort";
import { WeightedOutPortModel } from "./WeightedOutputPort";
import {
  common_get_node_connected_serie,
  common_get_serie_port,
  update_leaf_position,
  update_leaf_topology,
} from "../_common/common_functions";
import { SCT_API_URL } from "../../../../../../Constantes";
/*
    ---- Define el modelo del nodo (Weighted Average Block) ----
    Tipo de puertos a colocar en el nodo: 
        El número de puertos debe ser coherente con el widget
    Datos anexos al nodo:
        Datos que permitan construir el nodo
    Especifica la acciones dentro del nodo:
        Añadir puertos, quitar puertos, iniciar, cambiar info
*/

export type PortData = {
  name?: string;
  public_id: string;
  weight?: number;
};

export type WeightedNode = {
  name: string;
  type: string;
  editado: boolean;
  public_id: string;
  parent_id?: string;
  posx: number;
  posy: number;
  connections: Array<PortData>;
  serial_connection: PortData | undefined;
};

export type WeightedItem = {
  public_id: string;
  weight: number;
};

export interface WeightedNodeParams {
  PORT: SerialOutPortModel;
  node: WeightedNode;
}

// Aquí se definen las funciones del nodo

export class WeightedNodeModel extends NodeModel<
  WeightedNodeParams & NodeModelGenerics
> {
  data: WeightedNode;
  handle_msg: Function;
  handle_changes: Function;
  edited: boolean;
  valid: boolean;
  weight_from_widget: Object;
  weight: Array<WeightedItem>;
  weight_dict: Object;

  constructor(params: {
    node: any;
    handle_msg?: Function;
    handle_changes?: Function;
  }) {
    super({ type: "WeightedNode", id: params.node.public_id });
    this.data = params.node;
    this.handle_msg = params.handle_msg;
    this.handle_changes = params.handle_changes;
    this.addPort(new SerialOutPortModel("SERIE"));
    this.addPort(new InPortModel("InPut"));

    this.data.connections.forEach((weighted) => {
      this.addPort(
        new WeightedOutPortModel(weighted.public_id, weighted.weight)
      );
    });
    this.setPosition(this.data.posx, this.data.posy);
    this.edited = false;
    this.valid = false;
    this.weight = [];
    this.weight_dict = {};
  }

  // Manejando mensajes desde la creación del objeto:
  _handle_msg = (msg: Object) => {
    if (this.handle_msg !== null) {
      this.handle_msg(msg);
    }
  };

  // manejando los cambios del nodo:
  _handle_changes = (node: Object) => {
    if (this.handle_changes !== undefined) {
      this.handle_changes(node);
    }
  };

  create_if_not_exist = async () => {
    let result = null;
    if (this.data.public_id.includes("WeightedNode")) {
      await this.create_component().then((ans) => (result = ans));
    }
    return result;
  };

  create_component = async () => {
    console.log("lets create", this.data);
    let result = { success: false, bloqueleaf: null };
    // Este es un nodo nuevo:
    let path = `${SCT_API_URL}/component-leaf/comp-root/${this.data.parent_id}`;
    let payload = JSON.stringify({
      name: "PONDERADO",
      document: this.getType(),
      calculation_type: "PONDERADO",
      position_x_y: [this.getPosition().x, this.getPosition().y],
    });
    await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          let componente_leaf = json.component_leaf as WeightedNode;
          componente_leaf.parent_id = _.cloneDeep(this.data.parent_id);
          this.setNodeInfo(json.component_leaf);
          this._handle_changes(this);
          result = { success: json.success, bloqueleaf: json.component_leaf };
        }
      })
      .catch(console.log);
    this._handle_msg(result);
    return result;
  };

  // Actualiza la posición del elemento
  updatePosition = async () => {
    let answer = null;
    let promise = update_leaf_position(
      this.data.parent_id,
      this.data.public_id,
      this.getPosition().x,
      this.getPosition().y
    );
    await promise.then((result) => {
      this._handle_msg(result);
      answer = result;
    });
    return answer;
  };

  // Actualiza la topología del bloque
  updateTopology = async () => {
    let answer = null;
    await update_leaf_topology(
      this.data.parent_id,
      this.data.public_id,
      this.generate_topology()
    ).then((result) => (answer = result));
    return answer;
  };

  // Permite validar que el elemento ha sido correctamente conectado
  validate = () => {
    let valid = true;
    for (var type_port in this.getPorts()) {
      // todos los nodos deben estar conectados
      // a excepción del puerto SERIE ya que es opcional
      if (type_port !== "SERIE") {
        var port = this.getPorts()[type_port];
        valid = valid && Object.keys(port.links).length === 1;
      }
    }

    this.valid = valid;
    return valid;
  };

  // TODO: actualizar mensaje
  delete = () => {
    let path = `${SCT_API_URL}/component-leaf/comp-root/${this.data.parent_id}/comp-leaf/${this.data.public_id}`;
    fetch(path, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((json) => {
        console.log(json);
      });
  };

  // Esta función permite generar la topología a realizar dentro del bloque:
  // Se maneja dos tipode conexiones: Paralela, Serie
  generate_topology = () => {
    if (!this.validate()) {
      return null;
    }
    this.update_weight();
    let topology = {};
    let w_nodes = this.get_nodes_connected_weighted();
    let weight = [];
    for (const w_node of w_nodes) {
      let w = parseFloat(this.weight_dict[w_node.getID()]);
      if (isNaN(w)) {
        w = 100 / w_nodes.length;
      }
      weight.push({ public_id: w_node["data"]["public_id"], weight: w });
    }
    if (w_nodes) {
      topology["PONDERADO"] = weight;
    }
    let s_node = this.get_node_connected_serie();
    if (w_nodes && s_node) {
      // conexiones paralelas y serie
      topology = {
        SERIE: [topology, s_node.getID()],
      };
    } else if (s_node) {
      // solamente conexion serie
      topology["SERIE"] = [s_node["data"]["public_id"]];
    }
    return topology;
  };

  get_weighted_ports = () => {
    return _.filter(this.ports, (portModel) => {
      return portModel.getType() === "PONDERADO";
    });
  };

  // obtener puerto serie:
  get_serie_port = () => {
    return common_get_serie_port(this.ports);
  };

  // get node connected in SERIE port:
  get_node_connected_serie = () => {
    return common_get_node_connected_serie(this.ports);
  };

  get_nodes_connected_weighted = () => {
    let ports = this.get_weighted_ports();
    if (ports.length < 2) {
      return null;
    }
    // buscando los nodos conectados de manera PONDERADA
    let nodes = [];
    for (let id_port in ports) {
      let links = ports[id_port].links;
      for (let id_link in links) {
        if (links[id_link].getSourcePort().getType() !== "PONDERADO") {
          nodes.push(links[id_link].getSourcePort().getNode());
        } else {
          nodes.push(links[id_link].getTargetPort().getNode());
        }
      }
    }
    return nodes;
  };

  performanceTune = () => {
    this.validate();
    this._handle_changes({ node: this });
    return true;
  };

  setNodeInfo(data: WeightedNode) {
    this.data = data;
  }

  addWeightedPort = (public_id = null, weight = 0) => {
    this.add_weighted_port(public_id, weight);
    return { data: this.data };
  };

  add_weighted_port = (public_id = null, weight = 0) => {
    let newH = Object.assign([], this.data.connections);
    let next_id = newH.length > 0 ? (newH.length as number) + 1 : 1;
    public_id =
      public_id !== null
        ? public_id
        : "PWeighted_" + this.data.public_id + "_" + next_id;
    let p_port = {
      name: "",
      public_id: public_id,
      weight: weight,
    };
    this.weight.push({ public_id: public_id, weight: weight });
    newH.push(p_port);
    // edititing the node:
    this.data.connections = newH;
    return this.addPort(new WeightedOutPortModel(p_port.public_id, weight));
  };

  deleteWeightedPort = (id_port) => {
    let newH = [];
    // eliminando los links conectados a este puerto
    var port = this.getPort(id_port);
    var links = this.getPort(id_port).getLinks();
    for (var link in links) {
      this.getLink(link).remove();
    }
    // removiendo el puerto
    this.removePort(port);
    // actualizando la metadata del nodo:
    this.data.connections.forEach((port) => {
      if (port.public_id !== id_port) {
        newH.push(port);
      }
    });
    // edititing the node:
    this.data.connections = newH;
    return { data: this.data };
  };

  set_weight = (weight) => {
    this.weight_from_widget = weight;
    for (var ix in this.data.connections) {
      this.data.connections[ix].weight =
        weight[this.data.connections[ix].public_id];
      console.log("check2", weight[this.data.connections[ix].public_id]);
      this.weight_dict[this.data.connections[ix].public_id] =
        weight[this.data.connections[ix].public_id];
      console.log(this.weight_dict);
    }
  };

  update_weight = () => {
    let connected_id = null;
    let connected_node = null;
    this.weight = [];
    for (var id_port in this.weight_from_widget) {
      let port = this.getPort(id_port);
      if (!port) {
        continue;
      }
      let links = port.getLinks();
      for (var id_link in links) {
        let link = links[id_link];
        if (link.getSourcePort() && link.getTargetPort()) {
          if (link.getSourcePort().getType() === "InPort") {
            connected_node = link.getSourcePort().getNode();
            connected_id = connected_node.getID();
          } else {
            connected_node = link.getTargetPort().getNode();
            connected_id = connected_node.getID();
          }
          let weight = {
            public_id: connected_id,
            weight: this.weight_from_widget[id_port],
          };
          this.weight_dict[connected_id] = this.weight_from_widget[id_port];
          this.weight.push(weight);
        }
      }
    }
  };

  fireEvent = async (e, name) => {
    if (name === "validate") {
      let answer = { name: name, valid: this.valid };
      await this.create_if_not_exist().then((result) => {
        this._handle_changes(result);
        this.validate();
        let name = `${this.data.public_id}__${this.getType()}__${
          this.data.name
        }`;
        answer = { name: name, valid: this.valid };
      });
      return answer;
    }
    if (name === "save topology") {
      let answer = null;
      await this.updatePosition().then(async (resp) => {
        answer = await this.updateTopology();
        console.log("answer1", answer);
      });
      console.log("answer2", answer);
      return answer;
    }
  };
}
