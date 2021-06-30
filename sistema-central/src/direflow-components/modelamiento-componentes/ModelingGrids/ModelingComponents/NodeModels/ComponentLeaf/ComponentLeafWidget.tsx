import * as React from "react";
import { ComponentLeafModel } from "./ComponentLeafModel";
import {
  DefaultPortLabel,
  DiagramEngine,
  PortWidget,
} from "@projectstorm/react-diagrams";
import "./ComponentLeafStyle.css";
import {
  faCheck,
  faBullseye,
} from "@fortawesome/free-solid-svg-icons";
import * as _ from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReactTooltip from "react-tooltip";
import { ParallelOutPortModel } from "./ParallelOutputPort";

export interface ComponentLeafProps {
  node: ComponentLeafModel;
  engine: DiagramEngine;
  size?: number;
  handle_messages?: Function;
}

/**
 * @author Roberto Sánchez
 * this: es el contenido de un nodo, este tiene los atributos:
 * 	bck_node: 	los atributos del nodo original
 * 	node; 	    los tributos cambiados del nodo si se requiere
 */

export class ComponentLeafWidget extends React.Component<ComponentLeafProps> {
  bck_node: ComponentLeafModel; // original node
  node: ComponentLeafModel; // edited node
  state = {
    edited: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      edited: false,
    };
    this.node = _.cloneDeep(props.node);
    this.bck_node = _.cloneDeep(props.node);
  }

  componentDidUpdate = () => {
    if (this.node !== this.bck_node && !this.state.edited) {
      this.bck_node = _.cloneDeep(this.node);
      this.setState({ edited: true });
      this.node.data.editado = true;
    } 
  }
  
  _handle_message(msg: Object) {
    if (this.props.handle_messages !== undefined) {
      this.props.handle_messages(msg);
    }
  }

  _addParallelPort = () => {
    let newH = Object.assign([], this.node.data.parallel_connections);
    let next_id = newH.length > 0 ? (newH.length as number) + 1 : 1;
    let p_port = {
      nombre: "Sin conexión",
      public_id: "PPort_" + this.node.data.public_id + "_" + next_id,
    };
    newH.push(p_port);
    // making a backup of the last node:
    this.bck_node = _.cloneDeep(this.node);
    // edititing the node:
    this.node.data.parallel_connections = newH;
    this.props.node.addPort(new ParallelOutPortModel(p_port.public_id));
    this.is_edited();
  };

  _deleteParallelPort = (id_port) => {
    // lista nueva de puertos
    let newH = [];
    // identificando el puerto a eliminar
    var port = this.props.node.getPort(id_port);
    // eliminando los links conectados a este puerto
    var links = this.props.node.getPort(id_port).getLinks();
    for (var link in links) {
      this.props.node.getLink(link).remove();
    }
    // removiendo el puerto
    this.props.node.removePort(port);
    // actualizando la metadata del nodo:
    this.node.data.parallel_connections.forEach((port) => {
      if (port.public_id !== id_port) {
        newH.push(port);
      }
    });
    this.node.data.parallel_connections = newH;
    // cambiando el estado de editado:
    this.is_edited();
    let msg = { msg: "Se ha eliminado el puerto" };
    this._handle_message(msg);
    // actualizando el Canvas
    this.props.engine.repaintCanvas();
  };

  _disconnect_port = (port) => {
    var links = port.getLinks();
    for (var link in links) {
      this.props.node.getLink(link).remove();
    }
    this.is_edited();
    let msg = { msg: "Se ha realizado la desconexión" };
    this._handle_message(msg);
    // actualizando el Canvas
    this.props.engine.repaintCanvas();
  }

  _update_node = () => {
    this.node.data.editado = !this.node.data.editado;
    //this.is_edited();
    // actualizar posición del nodo
    this.node.updatePosition();
    // Guarda la configuración actual del nodo:
    // Generar topología de operaciones
    this.node.updateTopology();
    // Actualizar el lienzo
    this.props.engine.repaintCanvas();
  };

  _update_position = () => {
    // actualizar posición del nodo
    this.node.updatePosition().then((result) => {
      if (result.success) {
        // se encuentra sincronizado con la base de datos
        this.node.data.editado = false;
      } else {
        // los cambios no fueron guardados en base de datos
        this.node.data.editado = true;
      }
    }) 
  }

  is_edited = () => {
    if (_.isEqual(this.bck_node, this.node)) {
      this.setState({ edited: false });
    } else {
      this.setState({ edited: true });
    }
  };

  hasChanged = (old_word: string, new_word: string) => {
    if (old_word !== new_word && new_word.length > 3) {
      this.setState({ edited: true });
      return true;
    } else {
      this.setState({ edited: false });
      return false;
    }
  };

  generatePort(port) {
    return <DefaultPortLabel port={port} engine={this.props.engine} />;
  }

  /* Generación del título del nodo */
  generateTitle(node) {
    return (
      <div>
        <div data-tip={node.data.name} className="sr-node-title">
          {node.data.name}
        </div>
        <ReactTooltip />
        <div className="BtnContainer">
          {/* Permite guardar en base de datos la posición del elemento */}
          <FontAwesomeIcon
             icon={this.node.data.editado? faBullseye: faCheck}
             size="2x"
            className={"icon-off"}
            onClick={this._update_position}
          />
        </div>
      </div>
    );
  }

  /*Generación del puerto de entrada (inport) y conexión de salida de serial (SERIE) */
  generateInAndOutSerialPort = () => {
    return (
      <div className="Port-Container">
        <div className="in-port" key={_.uniqueId("InPort")}>
          <PortWidget
            className="InPort"
            port={this.props.node.getPort("InPut")}
            engine={this.props.engine}
          ></PortWidget>
          <button
            data-tip="Desconectar este puerto"
            className="widget-delete"
            onClick={() => this._disconnect_port(this.props.node.getPort("InPut"))}
          >
            -
          </button>
          <ReactTooltip />
          <span className="badge badge-warning badge-space">InPut</span>
        </div>
        <div className="out-serial-port" key={_.uniqueId("SERIEPort")}>
          <span className="badge badge-warning badge-space">SerOut</span>
          <PortWidget
            className="SerialOutPort"
            port={this.props.node.getPort("SERIE")}
            engine={this.props.engine}
          ></PortWidget>
          <button
            data-tip="Desconectar este puerto"
            className="widget-delete"
            onClick={() => this._disconnect_port(this.props.node.getPort("SERIE"))}
          >
            .
          </button>
          <ReactTooltip />
        </div>
      </div>
    );
  };

  /* Generando puerto en paralelo */
  generateParallelPort = () => {
    return this.node.data.parallel_connections.map((parallelPort) => (
      <div key={_.uniqueId("ParallelPort")} className="Port-Container">
        <button
          data-tip="Remover este puerto"
          className="widget-delete"
          onClick={() => this._deleteParallelPort(parallelPort.public_id)}
        >
          -
        </button>
        <ReactTooltip />
        <div className="ParallelLabel">
          {parallelPort.name!==undefined?
            parallelPort.name.substring(0, 15) : ""}{" "}
          <span className="badge badge-warning right">ParalOut</span>
        </div>
        <PortWidget
          className="ParallelPort"
          port={this.props.node.getPort(parallelPort.public_id)}
          engine={this.props.engine}
        ></PortWidget>
      </div>
    ));
  };

  // Esta sección define la vista/diseño de cada nodo
  // Widget
  render() {
    const { node } = this.props;
    return (
      <div
        className="node css-nlpftr"
        onClick={() => {
          this.props.node.setSelected(true);
        }}
        key={this.props.node.getID()}
      >
        <div className={this.props.node.valid? "sr-node": "sr-node in_error"}>
          {this.generateTitle(node)}
          {this.generateInAndOutSerialPort()}
          <button className="widget-add" onClick={this._addParallelPort}>
            +
          </button>

          {this.generateParallelPort()}
        </div>
      </div>
    );
  }
}

