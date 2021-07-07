import {
  NodeModel,
  NodeModelGenerics,
  PortModelAlignment,
} from "@projectstorm/react-diagrams";
import { SerialOutPortModel } from "./SerialOutputPort";
import { DefaultPortModel } from "@projectstorm/react-diagrams";
//import { NextPortModel } from '../../helpers/NextPortModel'
//import { NextPortLabel } from '../../helpers/NextPortLabelWidget'
import * as _ from "lodash";
import { InPortModel } from "./InPort";
import { ParallelOutPortModel } from "./ParallelOutputPort";
import {
  common_get_node_connected_serie,
  common_get_serie_port,
  update_leaf_position,
  update_leaf_topology,
} from "../_common/common_functions";
/*
    ---- Define el modelo del nodo (Leaf Block) ----
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

export type Node = {
  name: string;
  type: string;
  editado: boolean;
  public_id: string;
  parent_id?: string;
  posx: number;
  posy: number;
  parallel_connections: Array<PortData>;
  serial_connection: PortData | undefined;
};

export interface BlockNodeParams {
  PORT: SerialOutPortModel;
  node: Node;
}

// Aquí se definen las funciones del nodo

export class BlockNodeModel extends NodeModel<
  BlockNodeParams & NodeModelGenerics
> {
  data: Node;
  handle_msg: Function;
  handle_changes: Function;
  edited: boolean;
  valid: boolean;

  constructor(params: {
    node: any;
    handle_msg?: Function;
    handle_changes?: Function;
  }) {
    super({ type: "BloqueLeaf", id: params.node.public_id });
    this.data = params.node;
    this.handle_msg = params.handle_msg;
    this.handle_changes = params.handle_changes;
    this.addPort(new SerialOutPortModel("SERIE"));
    this.addPort(new InPortModel("InPut"));

    this.data.parallel_connections.forEach((parallel) => {
      this.addPort(new ParallelOutPortModel(parallel.public_id));
    });
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
    let valid = false;
    let n_parallel_ports = 0;
    let is_input_connected = false;
    for (var id_port in this.getPorts()) {
      // todos los nodos deben estar conectados
      // a excepción del puerto SERIE ya que es opcional
      var port = this.getPorts()[id_port];
      if (id_port === "InPut") {
        // valid = valid && Object.keys(port.links).length === 1;
        is_input_connected = Object.keys(port.links).length === 1;
      }
      // contando conexiones paralelas
      if (port.getType() === "PARALELO" && Object.keys(port.links).length === 1) {
        n_parallel_ports += 1;
      }
    }
    // Para el caso de conexiones paralelas:
    // en caso de no estar conectado totalmente
    // en caso que puertos paralelos esten conectados y el puerto serie también este conectado
    let all_disconnected = n_parallel_ports === 0 && !is_input_connected;
    valid = all_disconnected || (is_input_connected && (n_parallel_ports >= 2 || n_parallel_ports === 0));

    this.valid = valid;
    return valid;
  };

  // Esta función permite generar la topología a realizar dentro del bloque:
  // Se maneja dos tipode conexiones: Paralela, Serie
  generate_topology = () => {
    if (!this.validate()) {
      return null;
    }
    let topology = {};
    let p_nodes = this.get_nodes_connected_parallel();
    if (p_nodes) {
      let ids = [];
      p_nodes.forEach((port) => ids.push(port.getID()));
      topology["PARALELO"] = ids;
    }
    let s_node = this.get_node_connected_serie();
    if (p_nodes && s_node) {
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

  // add parallel ports:
  add_parallel_port = (name = "p-port") => {
    let id = _.uniqueId("p-port");
    this.data.parallel_connections.push({ name: name, public_id: id });
    return this.addPort(new ParallelOutPortModel(id));
  };

  // obtener puertos paralelos:
  get_parallel_ports = () => {
    return _.filter(this.ports, (portModel) => {
      return portModel.getType() === "PARALELO";
    });
  };

  // obtener puerto serie:
  get_serie_port = () => {
    return common_get_serie_port(this.ports);
  };

  get_nodes_connected_parallel = () => {
    let ports = this.get_parallel_ports();
    if (ports.length < 2) {
      return null;
    }
    // busancdo los nodos conectados de manera paralela
    let nodes = [];
    for (let id_port in ports) {
      let links = ports[id_port].links;
      for (let id_link in links) {
        if (links[id_link].getSourcePort().getType() !== "PARALELO") {
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
    this.validate();
    this._handle_changes({ node: this });
    return true;
  };

  setNodeInfo(_node: Node) {
    this.data = _node;
  }

  fireEvent = async (e, name) => {
    if (name === "validate") {
      this.updatePosition();
      this.validate();
      let name = `${this.data.public_id}__${this.getType()}__${this.data.name}`;
      return { name: name, valid: this.valid };
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
