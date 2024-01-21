import React, { Component } from "react";
import "./style.css";
import { SummaryReport, reporte_nodo } from "./Report";
import { Card, Badge, Button, Spinner } from "react-bootstrap";
import {
  faAngleDoubleUp,
  faAngleDoubleDown,
  faTrash,
  faPenFancy,
  faDownload,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReactTooltip from "react-tooltip";
import DetailReport from "./DetailReport";
import ReactJson from "react-json-view";
import * as _ from "lodash";
import { to_yyyy_mm_dd_hh_mm_ss } from "../../../Common/DatePicker/DateRange";
import { SRM_API_URL } from "../../../../Constantes";
import { documentVersion } from "../../../Common/CommonConstants";

type IndReportProps = {
  report: SummaryReport;
  document: string;
  calculating: boolean;
  ini_date: Date;
  end_date: Date;
  onChange: Function;
};

type IndReportState = {
  open: boolean;
  calculating: boolean;
  log: Object;
  disponibilidad: string;
  deleted: boolean;
  report: reporte_nodo | undefined;
};

const styleHeader = {
  padding: "3px",
};

class IndividualReport extends Component<IndReportProps, IndReportState> {
  tooltip: React.RefObject<unknown>;
  constructor(props) {
    super(props);
    let d = this._format_percentage(
      this.props.report.disponibilidad_promedio_ponderada_porcentage,
      3,
    );
    this.tooltip = React.createRef();
    this.state = {
      open: false,
      calculating: false,
      log: {},
      disponibilidad: d,
      deleted: false,
      edited: false,
      report: undefined,
    };
  }

  handle_changes_report = () => {
    this.props.onChange();
  };

  _format_percentage = (percentage: number, n: number) => {
    if (percentage === 100) {
      return "100";
    } else if (percentage < 0) {
      return "----";
    } else {
      return "" + percentage.toFixed(n);
    }
  };

  _format_date = (date) => {
    return String(date).split(".")[0];
  };

  _total_tags = () => {
    console.log("document here code", this.props.document);
    if (this.props.document !== documentVersion.finalReportV2) {
      return (
        this.props.report.procesamiento.numero_tags_total +
        this.props.report.novedades.tags_fallidas.length
      );
    }
    return 1000;
  };

  _porcentage_tags_cal = () => {
    let n = this._total_tags();
    if (n > 0) {
      return this._format_percentage(
        (this.props.report.procesamiento.numero_tags_total / n) * 100,
        1,
      );
    } else {
      return "-";
    }
  };

  _tooltip = () => {
    return (
      "<div>" +
      this.props.report.procesamiento.numero_entidades_procesadas +
      " entidades" +
      " </div> <div>" +
      this.props.report.procesamiento.numero_utrs_procesadas +
      " rtus / " +
      this.props.report.procesamiento.numero_tags_total +
      " tags" +
      "</div>"
    );
  };

  _open_close = () => {
    this.setState({ open: !this.state.open });
    if (!this.state.open) {
      this._get_details_for_this_report();
    }
  };

  _range_time = () => {
    return (
      to_yyyy_mm_dd_hh_mm_ss(this.props.ini_date) +
      "/" +
      to_yyyy_mm_dd_hh_mm_ss(this.props.end_date)
    );
  };

  _delete_cal_disponibilidad = async () => {
    const confirm = window.confirm(
      "Seguro que desea eliminar el cálculo de " +
        this.props.report.tipo +
        ": " +
        this.props.report.nombre +
        "? \n\n" +
        "Esta acción excluirá y eliminará el calculo de este nodo del reporte final. \nSi desea re-calcular este nodo, pulse el botón 'Re-calcular nodo'" +
        "\n\nNOTA! Una vez eliminado el cálculo, la única manera de volver a realizar el cálculo de este nodo \nserá mediante el botón RE-ESCRIBIR CÁLCULO de todos los nodos.",
    );
    if (confirm) {
      this.setState({ calculating: true, disponibilidad: "---" });
      let path = `${SRM_API_URL}/disp-sRemoto/disponibilidad/${
        this.props.report.tipo
      }/${this.props.report.nombre}/${this._range_time()}`;
      await fetch(path, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nodos: [this.props.report.nombre] }),
      })
        .then((res) => res.json())
        .then((json) => {
          this.setState({ log: json, calculating: false, deleted: true });
          this.handle_changes_report();
        })
        .catch(console.log);
    }
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
        message: msg + this.props.report.nombre,
      },
      calculating: true,
      disponibilidad: "---",
    });
    let path = `${SRM_API_URL}/disp-sRemoto/disponibilidad/nodos/${this._range_time()}`;
    let payload = {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nodos: [this.props.report.nombre] }),
    };

    await fetch(path, payload)
      .then((res) => res.json())
      .then((json) => {
        if (!json.success) {
          this.setState({ log: json.msg, calculating: false });
        } else {
          delete json.report;
          json["estado"] = "Finalizado";
          this.setState({ log: json, calculating: false, open: false });
          this.handle_changes_report();
        }
      })
      .catch(() => {
        this.setState({
          log: { estado: "error", msg: "No es posible conectar con la API" },
          calculating: false,
        });
      });
  };

  _get_details_for_this_report = () => {
    let path = `${SRM_API_URL}/disp-sRemoto/disponibilidad/${
      this.props.report.tipo
    }/${this.props.report.nombre}/${this._range_time()}`;

    fetch(path)
      .then((resp) => resp.json())
      .then((report) => {
        let novedades = {};
        if (report.tags_fallidas_detalle !== undefined) {
          novedades["tags_fallidas_detalle"] = report.tags_fallidas_detalle;
        }
        if (
          report.entidades_fallidas !== undefined &&
          report.entidades_fallidas.length > 0
        ) {
          novedades["entidades_fallidas"] = report.entidades_fallidas;
        }
        if (
          report.utr_fallidas !== undefined &&
          report.utr_fallidas.length > 0
        ) {
          novedades["utr_fallidas"] = report.utr_fallidas;
        }
        if (
          report.tags_fallidas !== undefined &&
          report.tags_fallidas.length > 0
        ) {
          novedades["tags_fallidas"] = report.tags_fallidas;
        }
        this.setState({ report: report, log: novedades });
      });
  };

  _download_log = (node_name) => {
    let file_name = node_name + ".log";
    let url = `${SRM_API_URL}/files/file/output/${file_name}?nid=${_.uniqueId(
      Math.random(),
    )}`;
    fetch(url).then((response) => {
      response.blob().then((blob) => {
        let url = window.URL.createObjectURL(blob);
        let a = document.createElement("a");
        a.href = url;
        a.download = file_name;
        a.click();
      });
    });
  };

  render() {
    console.log("report", this.props.report);
    return (
      <Card>
        <Card.Header
          style={styleHeader}
          onClick={(e) => {
            if (e.target.className === "card-header") {
              this._open_close();
            }
          }}
        >
          <div
            data-tip={this._tooltip()}
            data-html={true}
            className="ir-description"
          >
            <div className="ir-badge-v">
              <FontAwesomeIcon
                icon={this.state.open ? faAngleDoubleUp : faAngleDoubleDown}
                size="sm"
                className="ir-toggle-btn"
                onClick={() => {
                  this._open_close();
                }}
              />
              <Badge className="ir-badge-general" variant="dark">
                {this.state.disponibilidad} %
              </Badge>
            </div>
            <div className="ir-label">
              <div className="ir-tipo">{this.props.report.tipo}</div>
              <div>{this.props.report.nombre}</div>
            </div>
          </div>
          <ReactTooltip />

          <div className="ir-processing">
            <div className="ir-process-label"> Tags calculadas--</div>
            <div className="ir-process-value">
              {" "}
              {this._porcentage_tags_cal()}%
            </div>
            <div className="ir-process-label"> Total:</div>
            <div className="ir-process-value"> {this._total_tags()}</div>
          </div>
          <div className="ir-summary">
            <span className="ir-date">
              {this._format_date(this.props.report.actualizado)}
            </span>

            <span>
              {this.props.report.novedades.tags_fallidas.length === 0 ? (
                <Badge variant="success">Completo</Badge>
              ) : (
                <Badge variant="warning">
                  {this.props.report.novedades.tags_fallidas.length}
                  {" tags sin calcular"}
                </Badge>
              )}
            </span>
          </div>

          <Button
            data-tip="Eliminar cálculo"
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
          <ReactTooltip />
          <Button
            variant="outline-light"
            data-tip="Re-calcular nodo"
            className={
              this.state.calculating || this.props.calculating
                ? "src-btn-right btn-cal-disp-dis-small"
                : "src-btn-right btn-cal-disp-small"
            }
            onClick={() => this._cal_disponibilidad("PUT")}
          >
            <FontAwesomeIcon icon={faPenFancy} inverse size="sm" />
          </Button>
          <ReactTooltip />
        </Card.Header>
        <Card.Body
          className={this.state.open ? "collapse show" : "collapse"}
          style={{ padding: "5px" }}
        >
          {this.state.open && this.state.report ? (
            <DetailReport report={this.state.report} />
          ) : (
            <div>
              <Spinner animation="border" role="status" size="sm" />{" "}
              <span>Espere por favor, cargando...</span>{" "}
            </div>
          )}
          {this.state.report === undefined ? (
            <></>
          ) : (
            <div>
              <Button
                variant="outline-light"
                data-tip="Descargar archivo Log"
                className={
                  this.state.calculating || this.props.calculating
                    ? "btn-cal-disp-dis-small"
                    : "btn-cal-disp-small"
                }
                onClick={() => this._download_log(this.props.report.nombre)}
              >
                <FontAwesomeIcon icon={faDownload} inverse size="sm" />
              </Button>
              <ReactJson
                name="log"
                displayObjectSize={true}
                collapsed={true}
                iconStyle="circle"
                displayDataTypes={false}
                theme="monokai"
                src={this.state.log}
                style={{
                  minWidth: "92%",
                  float: "left",
                  marginRight: "7px",
                  marginTop: "7px",
                }}
              />
            </div>
          )}
        </Card.Body>
      </Card>
    );
  }
}
export default IndividualReport;
