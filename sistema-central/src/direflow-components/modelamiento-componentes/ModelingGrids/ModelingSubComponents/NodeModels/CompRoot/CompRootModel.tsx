import { NodeModel, NodeModelGenerics } from "@projectstorm/react-diagrams";
import * as _ from "lodash";
import { SCT_API_URL } from "../../../../../../Constantes";
import { OutPortModel } from "./RootPort";
/*
    ---- Define el modelo del root  ----
    Tipo de puertos a colocar en el nodo: 
        El número de puertos debe ser coherente con el widget
    Datos anexos al nodo:
        Datos que permitan construir el nodo
    Especifica la acciones dentro del nodo:
        Añadir puertos, quitar puertos, iniciar, cambiar info
*/

export type Root = {
  name: string;
  type: string;
  editado: boolean;
  public_id: string;
  parent_id?: string;
  posx: number;
  posy: number;
};

export interface CompRootParams {
  PORT: OutPortModel;
  root: Root;
}

// Aquí se definen las funciones del nodo

export class CompRootModel extends NodeModel<
  CompRootParams & NodeModelGenerics
> {
  data: Root;
  handle_msg: Function;
  handle_changes: Function;
  edited: boolean;
  valid: boolean;

  constructor(params: { root: any; handle_msg?: Function, handle_changes?: Function }) {
    super({ type: "CompRoot", id: params.root.public_id });
    this.data = params.root;
    this.handle_msg = params.handle_msg;
    this.handle_changes = params.handle_changes;
    this.addPort(new OutPortModel("ROOT"));
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
  }

  updatePosition = async () => {
    let result = { success: false, msg: "Enviando petición" };
    let path = `${SCT_API_URL}/component-root/${this.data.public_id}/position`;  
    let body = { pos_x: this.getPosition().x, pos_y: this.getPosition().y };
    await fetch(path, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
      .then((res) => res.json())
      .then((json) => {
        this._handle_msg(json);
        result = json;
      })
      .catch(console.log);
    return result;
  };

  updateTopology = async() => {
    let topology = this.generate_topology();
    let answer = {success: false, msg: "Enviando petición"}
    if (!topology) { return }
    let path = `${SCT_API_URL}/component-root/${this.data.public_id}/topology`;
    let body = { topology: topology };
    await fetch(path, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
      .then((res) => res.json())
      .then((json) => {
        answer = json;
      })
      .catch(console.log);
    return answer;
  };

  validate = () => {
    let valid = true;
    for (var name_port in this.getPorts()) {
      var port = this.getPorts()[name_port];
      valid = valid && Object.keys(port.links).length === 1;
    }
    this.valid = valid;
    return valid;
  };

  // Esta función permite generar la topología a realizar dentro del bloque:
  // Al ser solamente la operación Root la única que se puede realizar
  // entonces la operación queda reducida a:
  generate_topology = () => {
    if (!this.validate()) {
      return null;
    }
    let connected_node = this.get_node_connected_to_root();
    return {
      ROOT: [connected_node["data"]["public_id"]],
    };
  };

  get_root_port = () => {
    let ports = this.getPorts();
    for (var id_port in ports) {
      let port = ports[id_port];
      if (port.getType() === "ROOT") {
        return port;
      }
    }
    return null;
  };

  // obtiene el node al que está conectado el ROOT
  get_node_connected_to_root = () => {
    let root_node = this.get_root_port();
    if (root_node === null) {
      return null;
    }
    let links = root_node.links;
    for (var id_link in links) {
      let link = links[id_link];
      if (link.getSourcePort().getType() !== "ROOT") {
        return link.getSourcePort().getNode();
      } else {
        return link.getTargetPort().getNode();
      }
    }
  };

  performanceTune = () => {
    this._handle_changes({"node": this})
    this.validate();
    return true;
  };

  setRootInfo(_root: Root) {
    this.data = _root;
  }

  getOutPorts() {
    return _.filter(this.ports, (portModel) => {
      return !portModel.in;
    });
  }
  fireEvent = async (e, name) => {
    if (name === "validate") {
      this.updatePosition();
      this.validate();
      let name = `${this.data.public_id}__${this.getType()}__${this.data.name}`;
      return {name: name, valid: this.valid}
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
  }
  
}
