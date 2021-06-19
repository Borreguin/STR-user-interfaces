import React, { Component } from "react";
import {
  Card,
  Button,
  Badge,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { Node, Entity } from "./ReportModel";
import * as _ from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDoubleDown,
  faAngleDoubleUp,
  faTrash,
  faPencilAlt,
  faPenFancy,
} from "@fortawesome/free-solid-svg-icons";
import { to_yyyy_mm_dd_hh_mm_ss } from "../../DatePicker/DateRange";
import "./Report.css";
import ReactJson from "react-json-view";
import { SRM_API_URL } from "../../../Pages/sRemoto/Constantes";

export interface RepGeneralProps {
  node: Node;
  ini_date: Date;
  end_date: Date;
  calculating: boolean;
}

export type RepGeneralState = {
  open: boolean;
  edited: boolean;
  disponibilidad: string;
  message: string;
  visible: boolean;
  log: {};
  calculating: boolean;
};

class RepGeneral extends Component<RepGeneralProps, RepGeneralState> {
  bck_node: Node; // original node
  lcl_node: Node; // edited node
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      edited: false,
      disponibilidad: "-",
      message: "",
      visible: false,
      calculating: false,
      log: { estado: "Listo", message: "Listo para realizar cálculo" },
    };
    this.lcl_node = _.cloneDeep(props.node);
    // this.bck_node = _.cloneDeep(props.node);
  }


  is_edited = () => {
    if (_.isEqual(this.bck_node, this.lcl_node)) {
      this.setState({ edited: false });
    } else {
      this.setState({ edited: true });
    }
  };
  // permite manejar los cambios ocurridos en el hijo:
  // new_entities viene desde el hijo como consecuencia
  // de un cambio
  handle_entities_change = (new_entities: Entity[]) => {
    this.lcl_node.entidades = new_entities;
    this.is_edited();
  };

  // permite indicar cuando un nodo has sido actualizado
  // mediante archivo
  handle_on_node_upload = (new_node) => {
    this.setState({ edited: true });
    this.lcl_node = _.cloneDeep(new_node);
    this.bck_node = _.cloneDeep(new_node);
    console.log(this.lcl_node);
    this.setState({ edited: false });
  };

  _n_entidades = () => {
    return this.lcl_node.entidades.length;
  };

  _n_rtus = () => {
    let n_rtu = 0;
    this.lcl_node.entidades.forEach((entidad) => {
      n_rtu += entidad.utrs;
    });
    return n_rtu;
  };

  _range_time = () => {
    return (
      to_yyyy_mm_dd_hh_mm_ss(this.props.ini_date) +
      "/" +
      to_yyyy_mm_dd_hh_mm_ss(this.props.end_date)
    );
  };

  _cal_disponibilidad = async (method) => {
    let msg = "";
    if (method === "POST") {
      msg = "Empezando cálculo del nodo: \n";
    } else {
      msg = "Empezando rescritura de cálculos del nodo: \n";
    }

    this.setState({
      log: {
        estado: "Iniciando",
        message: msg + this.lcl_node.nombre,
      },
      calculating: true,
    });
    let path = `${SRM_API_URL}/disp-sRemoto/disponibilidad/nodos/${this._range_time()}`;
    let payload = {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nodos: [this.lcl_node.nombre] }),
    };

    await fetch(path, payload)
      .then((res) => res.json())
      .then((json) => {
        if (!json.success) {
          this.setState({ log: json.msg, edited: true, calculating: false });
        } else {
          let report = json["report"];
          delete json.report;
          json["estado"] = "Finalizado";
          this.setState({ log: json, edited: true, calculating: false });
          
        }
      }).catch((res) => { 
        this.setState({
          log: { estado: "error", msg: "No es posible conectar con la API" },
          calculating: false
        })
      });
  };

  _delete_cal_disponibilidad = async () => {
    const confirm = window.confirm(
      "Seguro que desea eliminar el cálculo?: " +
        this.lcl_node.tipo +
        ": " +
        this.lcl_node.nombre
    );
    if (confirm) {
      this.setState({calculating: true });
      let path = `${SRM_API_URL}/disp-sRemoto/disponibilidad/nodos/${this._range_time()}`;
      await fetch(path, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nodos: [this.lcl_node.nombre] }) })
        .then((res) => res.json())
        .then((json) => {
          this.setState({ log: json, edited: true, calculating: false });
        })
        .catch(console.log);
    }
  };

  render() {
    if (this.bck_node === null) return <></>;
    return (
      <Card>
        <Card.Header
          style={{ paddingTop: "3px", paddingBottom: "3px" }}
          onClick={(e) => {
            if (e.target.className === "card-header") {
              this.setState({ open: !this.state.open });
            }
          }}
        >
          <OverlayTrigger
            key={this.lcl_node.nombre}
            placement="right"
            overlay={
              <Tooltip id={"tooltip-"+ this.lcl_node.nombre}>
                {this._n_entidades() + " entidades"}
                <br></br> {this._n_rtus() + " rtus / "}
                {this.lcl_node.n_tags + " tags"}
              </Tooltip>
            }
          >
            <div className="sc-description">
              <div className="sc-badge-v">
                <FontAwesomeIcon
                  icon={this.state.open ? faAngleDoubleUp : faAngleDoubleDown}
                  size="sm"
                  className="toggle-btn"
                  onClick={() => {
                    this.setState({ open: !this.state.open });
                  }}
                />
                <Badge className="badge-general" variant="dark">
                  {this.state.disponibilidad}
                </Badge>
              </div>

              <div className="sc-label">
                <div>{this.lcl_node.tipo}</div>
                <div>{this.lcl_node.nombre}</div>
              </div>
            </div>
          </OverlayTrigger>
          <Button
            variant="outline-light"
            className={
              this.state.calculating || this.props.calculating
                ? "src-btn-right btn-cal-disp-dis-small"
                : "src-btn-right scr-btn-trash"
            }
            onClick={this._delete_cal_disponibilidad}
          >
            <FontAwesomeIcon icon={faTrash} inverse size="sm" />
          </Button>
          <Button
            variant="outline-light"
            className={
              this.state.calculating || this.props.calculating
                ? "src-btn-right btn-cal-disp-dis-small"
                : "src-btn-right btn-cal-disp-small"
            }
            onClick={() => this._cal_disponibilidad("PUT")}
          >
            <FontAwesomeIcon icon={faPenFancy} inverse size="sm" />
          </Button>
          <Button
            variant="outline-light"
            className={
              this.state.calculating || this.props.calculating
                ? "src-btn-right btn-cal-disp-dis-small"
                : "src-btn-right btn-cal-disp-small"
            }
            onClick={() => this._cal_disponibilidad("POST")}
          >
            <FontAwesomeIcon icon={faPencilAlt} inverse size="sm" />
          </Button>
        </Card.Header>
        <Card.Body className={this.state.open ? "collapse show" : "collapse"}
          style={{padding:"5px"}}
        >
          <div >
            <div
              className={this.state.edited ? "sc-log-changed" : "sc-log-normal"}
              onClick={() => {
                this.setState({ edited: false });
              }}
            >
              <ReactJson
                name={this.lcl_node.nombre}
                displayObjectSize={true}
                collapsed={true}
                iconStyle="circle"
                displayDataTypes={false}
                theme="monokai"
                src={this.state.log}
              />
            </div>
          </div>
        </Card.Body>
      </Card>
    );
  }
}

export default RepGeneral;

