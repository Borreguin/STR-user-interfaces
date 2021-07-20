import { NodeModel, NodeModelGenerics } from "@projectstorm/react-diagrams";
import { SerialOutPortModel } from "./SerialOutputPort";
import * as _ from "lodash";
import { InPortModel } from "./InPort";
import { AverageOutPortModel } from "./AverageOutputPort";
import {
  common_get_node_connected_serie,
  common_get_serie_port,
  update_leaf_position,
  update_leaf_topology,
} from "../_common/common_functions";
import { SCT_API_URL } from "../../../../../../Constantes";
/*
    ---- Define el modelo del nodo (Average Block) ----
    Tipo de puertos a colocar en el nodo: 
        El número de puertos debe ser coherente con el widget
    Datos anexos al nodo:
        Datos que permitan construir el nodo
    Especifica la acciones dentro del nodo:
        Añadir puertos, quitar puertos, iniciar, cambiar info
*/

export type PortData = {
  name: string;
  public_id: string;
};

export type AverageNode = {
  public_id: string;
  name: string;
  type: string;
  editado?: boolean;
  parent_id?: string;
  posx: number;
  posy: number;
  connections: Array<PortData>;
  serial_connection: PortData | undefined;
};

export interface AverageNodeParams {
  PORT: SerialOutPortModel;
  node: AverageNode;
}

// Aquí se definen las funciones del nodo

export class AverageNodeModel extends NodeModel<
  AverageNodeParams & NodeModelGenerics
> {
  data: AverageNode;
  handle_msg: Function;
  handle_changes: Function;
  edited: boolean;
  valid: boolean;

  constructor(params: {
    node: any;
    handle_msg?: Function;
    handle_changes?: Function;
  }) {
    super({ type: "AverageNode", id: params.node.public_id });
    this.data = params.node;
    this.handle_msg = params.handle_msg;
    this.handle_changes = params.handle_changes;
    this.addPort(new SerialOutPortModel("SERIE"));
    this.addPort(new InPortModel("InPut"));

    /*this.data.connections.forEach((port) => {
      this.addPort(new AverageOutPortModel(port.public_id));
    });*/
    this.setPosition(this.data.posx, this.data.posy);
    this.edited = false;
    this.valid = false;
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
    if (this.data.public_id.includes("AverageNode")) {
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
      name: "PROMEDIO",
      document: this.getType(),
      calculation_type: "PROMEDIO",
      position_x_y: [this.getPosition().x, this.getPosition().y],
    });
    await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
    })
      .then((res) => res.json())
      .then((json) => {
        let component_leaf = json.component_leaf as AverageNode;
        component_leaf.parent_id = _.cloneDeep(this.data.parent_id);
        this.setNodeInfo(json.component_leaf);
        result = { success: json.success, bloqueleaf: json.component_leaf };
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
    ).then((result) => answer = result);
    return answer
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
  // Se maneja dos tipode conexiones: promedio, Serie
  generate_topology = () => {
    if (!this.validate()) {
      return null;
    }
    let topology = {};
    let a_nodes = this.get_nodes_connected_average();
    if (a_nodes) {
      let ids = [];
      a_nodes.forEach((port) => ids.push(port.getID()));
      console.log(a_nodes);
      topology["PROMEDIO"] = ids;
    }
    let s_node = this.get_node_connected_serie();
    if (a_nodes && s_node) {
      // conexiones promedio y serie
      topology = {
        SERIE: [topology, s_node.getID()],
      };
    } else if (s_node) {
      // solamente conexion serie
      topology["SERIE"] = [s_node["data"]["public_id"]];
    }
    return topology;
  };

  // obtener puertos PROMEDIOs:
  get_average_ports = () => {
    return _.filter(this.ports, (portModel) => {
      return portModel.getType() === "PROMEDIO";
    });
  };

  // obtener puerto serie:
  get_serie_port = () => {
    return common_get_serie_port(this.ports);
  };

  get_nodes_connected_average = () => {
    let ports = this.get_average_ports();
    if (ports.length < 2) {
      return null;
    }
    // buscando los nodos conectados para operación promedio
    let nodes = [];
    for (let id_port in ports) {
      let links = ports[id_port].links;
      for (let id_link in links) {
        if (links[id_link].getSourcePort().getType() !== "PROMEDIO") {
          nodes.push(links[id_link].getSourcePort().getNode());
        } else {
          nodes.push(links[id_link].getTargetPort().getNode());
        }
      }
    }
    return nodes;
  };

  // get node connected in SERIE port:
  get_node_connected_serie = () => {
    return common_get_node_connected_serie(this.ports);
  };

  performanceTune = () => {
    this._handle_changes({ node: this });
    this.validate();
    return true;
  };

  setNodeInfo(data: AverageNode) {
    this.data = data;
  }

  addAveragePort = () => {
    this.add_average_port();
    return { data: this.data };
  };

  add_average_port = () => {
    let newH = Object.assign([], this.data.connections);
    let next_id = newH.length > 0 ? (newH.length as number) + 1 : 1;
    let p_port = {
      name: "",
      public_id: "PAverage_" + this.data.public_id + "_" + next_id,
    };
    newH.push(p_port);
    // edititing the node:
    this.data.connections = newH;
    return this.addPort(new AverageOutPortModel(p_port.public_id));
  };

  deleteAveragePort = (id_port) => {
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
