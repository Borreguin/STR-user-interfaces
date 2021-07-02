import * as React from "react";
import { CompRootModel } from "./CompRootModel";
import {
  DiagramEngine,
  PortWidget,
} from "@projectstorm/react-diagrams";
import "./CompRootStyle.css";
import {
  faCheck,
  faBullseye,
} from "@fortawesome/free-solid-svg-icons";
import * as _ from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReactTooltip from "react-tooltip";

export interface CompWidgetProps {
  node: CompRootModel;
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

export class CompRootWidget extends React.Component<CompWidgetProps> {
  bck_node: CompRootModel; // original node
  node: CompRootModel; // edited node
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

  _update_node = () => {
    this.is_edited();
    // actualizar posición del nodo
    this.node.updatePosition();
    // Guarda la configuración actual del nodo:
    // Generar topología de operaciones
    this.node.updateTopology();
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

  _disconnect_port = (port) => {
    var links = port.getLinks();
    for (var link in links) {
      this.node.getLink(link).remove();
    }
    this.is_edited();
    let msg = { msg: "Se ha realizado la desconexión" };
    this.node._handle_msg(msg);
    // actualizando el Canvas
    this.props.engine.repaintCanvas();
  }

  is_edited = () => {
    if (_.isEqual(this.bck_node, this.node)) {
      this.setState({ edited: false });
      this.node.data.editado= false;
    } else {
      this.setState({ edited: true });
      this.node.data.editado = true;
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
        
        <div className="root-port" key={_.uniqueId("ROOT")}>
          <span className="badge badge-warning badge-space">Root</span>
          <button
            data-tip="Desconectar este puerto"
            className="widget-disconnect"
            onClick={() => this._disconnect_port(this.props.node.getPort("ROOT"))}
          >
            -
          </button>
          <ReactTooltip />
          <PortWidget
            className="SerialOutPort"
            port={this.props.node.getPort("ROOT")}
            engine={this.props.engine}
          ></PortWidget>
        </div>
      </div>
    );
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
        <div className={this.props.node.valid? "cmp-root": "cmp-root in_error"} >
          {this.generateTitle(node)}
          {this.generateInAndOutSerialPort()}
        </div>
      </div>
    );
  }
}

