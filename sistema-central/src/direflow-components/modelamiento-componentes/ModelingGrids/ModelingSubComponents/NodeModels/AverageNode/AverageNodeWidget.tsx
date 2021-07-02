import * as React from "react";
import { AverageNode, AverageNodeModel } from "./AverageNodeModel";
import { DiagramEngine, PortWidget } from "@projectstorm/react-diagrams";
import "./AverageNodeStyle.css";
import { faTrash, faSave, faCheck } from "@fortawesome/free-solid-svg-icons";
import * as _ from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReactTooltip from "react-tooltip";

export interface AverageNodeWidgetProps {
  node: AverageNodeModel;
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

export class AverageNodeWidget extends React.Component<AverageNodeWidgetProps> {
  bck_node: AverageNodeModel; // original node
  node: AverageNodeModel; // edited node
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

  _handle_message(msg: Object) {
    if (this.props.handle_messages !== undefined) {
      this.props.handle_messages(msg);
    }
  }

  _addAveragePort = () => {
    // making a backup of the last node:
    this.bck_node = _.cloneDeep(this.node);
    // añadiendo puerto:
    var resp = this.node.addAveragePort();
    this.node.data = resp.data;
    // actualizando estado de editado
    this.is_edited();
    this.props.engine.repaintCanvas();
  };

  _deleteAveragePort = (id_port) => {
    // identificando si es posible eliminar el puerto:
    if (Object.keys(this.props.node.getPorts()).length <= 4) {
      let msg = {
        msg: "No se puede eliminar este puerto, se desconecta solamente.",
      };
      this._handle_message(msg);
      let port = this.props.node.getPort(id_port);
      this._disconnect_port(port);
      return;
    }
    // eliminando el puerto y links
    var resp = this.node.deleteAveragePort(id_port);
    this.node.data = resp.data;
    this.is_edited();
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
  };

  _update_node = () => {
    // Guarda la configuración actual del nodo:
    // this.node.data.editado = !this.node.data.editado;
    // si AverageNode está en el ID, entonces no existe aún en base de datos:
    if (this.node.data.public_id.includes("AverageNode")) {
      this.node.create_component().then((result) => {
        if (result.success) {
          let bloqueleaf = _.cloneDeep(result.bloqueleaf) as AverageNode;
          bloqueleaf.connections = this.node.data.connections;
          this.node.setNodeInfo(bloqueleaf);
          // Generar topología de operaciones
          // this.node.updateTopology();
        }
      });
    } else {
      // actualizar posición del nodo
      this.node.updatePosition();
      // Generar topología de operaciones
      // this.node.updateTopology();
    }

    // Actualizar el lienzo
    this.props.engine.repaintCanvas();
  };

  _delete_node = () => {
    this.node.data.editado = !this.node.data.editado;
    let node = this.props.engine.getModel().getNode(this.node.getID());
    let ports = node.getPorts();
    for (var p in ports) {
      let port = ports[p];
      let links = port.getLinks();
      for (var id_l in links) {
        let link = links[id_l];
        this.props.node.getLink(id_l).remove();
        this.props.engine.getModel().removeLink(link);
      }
    }
    this.node.delete();
    this.props.engine.getModel().removeNode(node);
    this.props.engine.repaintCanvas();
  };

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

  /* Generación del título del nodo */
  generateTitle(node) {
    return (
      <div>
        <div data-tip={node.data.name} className="sr-node-title">
          {node.data.name}
        </div>
        <ReactTooltip />
        <div className="BtnContainer">
          {/* Permite eliminar el elemento*/}
          <FontAwesomeIcon
            icon={faTrash}
            size="2x"
            className="removeIcon"
            onClick={this._delete_node}
          />
          {/* Permite guardar en base de datos la posición del elemento */}
          <FontAwesomeIcon
            icon={this.node.data.editado ? faCheck : faSave}
            size="2x"
            className={this.node.data.editado ? "icon-on" : "icon-off"}
            onClick={this._update_node}
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
            onClick={() =>
              this._disconnect_port(this.props.node.getPort("InPut"))
            }
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
            onClick={() =>
              this._disconnect_port(this.props.node.getPort("SERIE"))
            }
          >
            .
          </button>
          <ReactTooltip />
        </div>
      </div>
    );
  };

  /* Generando puerto en paralelo */
  generateAveragePort = () => {
    if (this.node.data.connections === undefined) {
      return <></>;
    }
    return this.node.data.connections.map((averagePort) => (
      <div key={_.uniqueId("AveragePort")} className="Port-Container">
        <button
          data-tip="Remover este puerto"
          className="widget-delete"
          onClick={() => this._deleteAveragePort(averagePort.public_id)}
        >
          -
        </button>
        <ReactTooltip />
        <div className="ParallelLabel">
          {/*averagePort.name*/}{" "}
          <span className="badge badge-warning right">PromOut</span>
        </div>

        <PortWidget
          className="AveragePort"
          port={this.props.node.getPort(averagePort.public_id)}
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
        <div
          className={
            this.props.node.valid ? "sr-average" : "sr-average in_error"
          }
        >
          {this.generateTitle(node)}
          {this.generateInAndOutSerialPort()}

          <button className="widget-add" onClick={this._addAveragePort}>
            +
          </button>

          {this.generateAveragePort()}
        </div>
      </div>
    );
  }
}
