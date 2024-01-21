import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Spinner, Form, Row, Col, Button } from "react-bootstrap";
import ReactJson from "react-json-view";
import NodeReport from "./SRCalDisponibilidad_nodes";
import * as _ from "lodash";
import ReactDateCSS from "react-date-range/dist/styles.css"; // main style file
import ReactDateThemeCSS from "react-date-range/dist/theme/default.css"; // theme css file
import { Styled } from "direflow-component";
import {
  get_last_month_dates,
  to_yyyy_mm_dd,
  to_yyyy_mm_dd_hh_mm_ss,
} from "../Common/DatePicker/DateRange";
import { SRM_API_URL } from "../../Constantes";
import SRGeneralReport from "./Cards/SRReport/GeneralReport";
import { Report } from "./Cards/SRReport/Report";
import styles from "./App.css";
import ReportCSS from "./Cards/Report/Report.css";
import SRCardCSS from "./Cards/SRCard/SRCard.css";
import SRReportCSS from "./Cards/SRReport/style.css";
import { ButtonSection } from "./Components/ButtonSection";
import { DatePickSelector } from "./Components/DatePickSelector";
import { SearchSection } from "./Components/SearchSection";
import { documentVersion } from "../Common/CommonConstants";
// import ModalCSS from "./Modal.css"

interface props {}

interface state {
  ini_date: Date;
  ini_date_str: string;
  end_date: Date;
  end_date_str: string;
  filtered_reports: Array<any>; // lista de reportes filtrados
  report: Report; // reporte entero
  search: string; // filtrar reportes
  loading: boolean;
  calculating: boolean;
  umbral: Number;
  log: Object;
  edited: boolean;
  msg: string;
  range: Object;
  show_date: boolean;
  document: string;
  general_report_id: string;
  successFinish: boolean;
}

// Pagina inicial de manejo de nodos:
class SRCalDisponibilidad extends Component<props, state> {
  /* Configuración de la página: */
  constructor(props) {
    super(props);
    let r = get_last_month_dates();
    let range = {
      startDate: r.first_day_month,
      endDate: r.last_day_month,
      key: "selection",
    };
    this.state = {
      ini_date: r.first_day_month,
      ini_date_str: to_yyyy_mm_dd_hh_mm_ss(r.first_day_month),
      end_date: r.last_day_month,
      end_date_str: to_yyyy_mm_dd_hh_mm_ss(r.last_day_month),
      brand: { route: "/Pages/sRemoto", name: "Cálculo de disponibilidad " },
      navData: [],
      filtered_reports: undefined, // lista de reportes filtrados
      report: undefined, // reporte entero
      search: "", // filtrar reportes
      loading: true,
      calculating: false,
      umbral: 0,
      log: { estado: "Cargando información ..." },
      edited: false,
      msg: "",
      range: [range],
      show_date: false,
      document: undefined,
      general_report_id: undefined,
      successFinish: true,
    };
  }

  async componentDidMount() {
    this._search_report_now();
  }

  // permite manejar cambios ocurridos en detalle de cálculo:
  handle_calculation_details = () => {
    this._search_report_now();
  };

  // cuando finaliza el cálculo
  handle_finish_calculation = (
    calculation_log: Object,
    successFinish: boolean,
  ) => {
    if (this.state.calculating) {
      this.setState({ calculating: false, log: calculation_log });
    }
    if (successFinish) {
      this._search_report_now().then(() => {
        this.setState({ loading: false });
      });
    }
  };

  // actualiza el valor del umbral a reportar:
  _updateUmbral = (e) => {
    let umbral = parseFloat(e.target.value.trim());
    if (!isNaN(umbral)) {
      this.setState({ umbral: umbral });
    }
  };

  _search_report_now = async () => {
    // buscar el reporte en el periodo
    if (String(this.state.ini_date) === String(this.state.end_date)) {
      let msg = "Seleccione fechas distintas para el cálculo";
      this.setState({
        loading: false,
        edited: true,
        calculating: false,
        log: { msg: msg },
        msg: msg,
        umbral: 0,
      });
      return;
    }
    this.setState({
      filtered_reports: undefined,
      loading: true,
      report: undefined,
      calculating: false,
    });
    await fetch(
      SRM_API_URL + "/disp-sRemoto/disponibilidad/" + this._range_time(),
    )
      .then((res) => res.json())
      .then((json) => {
        console.log("summary report", json.report?.documento);
        if (json.success) {
          this.setState({
            report: json.report,
            document: json.report?.documento,
          });
          this._filter_reports(this.state.search);
        } else {
          this.setState({ msg: json.msg });
        }
        // cargando novedades en caso existan:
        if (
          json.report !== undefined &&
          json.report.novedades !== undefined &&
          json.report.novedades.detalle !== undefined
        ) {
          this.setState({ log: json.report.novedades.detalle });
        }
      })
      .catch((error) => {
        let msg =
          "Ha fallado la conexión con la API de cálculo de disponibilidad";
        this.setState({ log: { error: msg }, msg: msg });
        console.log(error);
      });
    this.setState({ loading: false });
  };

  _update_search = (text: string) => {
    this.setState({ search: text.trim() });
  };

  _filter_reports = (e) => {
    let to_filter = "";
    if (e.target !== undefined) {
      to_filter = String(e.target.value).toLowerCase();
    } else {
      to_filter = String(e).toLowerCase();
    }
    let filtered_reports = [];
    if (to_filter === "" && this.state.report !== undefined) {
      this.setState({ filtered_reports: this.state.report.reportes_nodos });
    } else if (this.state.report !== undefined) {
      this.state.report.reportes_nodos.forEach((report, ix) => {
        if (report.nombre.toLowerCase().includes(to_filter)) {
          filtered_reports.push(this.state.report.reportes_nodos[ix]);
        }
      });
      this.setState({ filtered_reports: filtered_reports });
    }
  };

  _notification = () => {
    if (this.state.loading) {
      return this._loading();
    }

    if (this.state.report === undefined) {
      return this._show_message();
    }
  };

  _loading = () => {
    return (
      <div>
        <Spinner animation="border" role="status" size="sm" />
        <span> Espere por favor, cargando ...</span>
      </div>
    );
  };

  _show_message = () => {
    let msg = this.state.msg;
    if (typeof this.state.msg !== "string") {
      msg = "Observar novedades para más detalles";
    }
    return (
      <div>
        <span>{msg}</span>
      </div>
    );
  };

  _range_time = () => {
    return (
      to_yyyy_mm_dd_hh_mm_ss(this.state.ini_date) +
      "/" +
      to_yyyy_mm_dd_hh_mm_ss(this.state.end_date)
    );
  };

  _nodes_names = () => {
    let node_names = [];
    if (this.state.filtered_reports !== undefined)
      this.state.filtered_reports.forEach((report) => {
        node_names.push(report.nombre);
      });
    return node_names;
  };

  // descargar reporte Excel:
  _download_excel_report = async () => {
    let url = `${SRM_API_URL}/sRemoto/disponibilidad/excel/${this._range_time()}?nid=${_.uniqueId(
      Math.random(),
    )}`;
    let filename = `Reporte_${to_yyyy_mm_dd(
      this.state.ini_date,
    )}@${to_yyyy_mm_dd(this.state.end_date)}.xlsx`;

    this.setState({
      log: { estado: "Iniciando descarga de reporte, espere por favor" },
      loading: true,
    });
    await fetch(url).then((response) => {
      response.blob().then((blob) => {
        let url = window.URL.createObjectURL(blob);
        let a = document.createElement("a");
        a.href = url;
        a.download = filename;
        a.click();
      });
    });
    this.setState({
      log: { estado: "Descarga de reporte finalizado" },
      loading: false,
    });
  };

  // descargar reporte de tags:
  _download_tag_report = async () => {
    let url = `${SRM_API_URL}/sRemoto/indisponibilidad/tags/excel/${this._range_time()}/${
      this.state.umbral
    }?nid=${_.uniqueId(Math.random())}`;
    this.setState({
      log: { estado: "Iniciando descarga de reporte, espere por favor" },
      loading: true,
    });
    let filename = `IndispTag_${to_yyyy_mm_dd(
      this.state.ini_date,
    )}@${to_yyyy_mm_dd(this.state.end_date)}.xlsx`;

    await fetch(url).then((response) => {
      response.blob().then((blob) => {
        let url = window.URL.createObjectURL(blob);
        let a = document.createElement("a");
        a.href = url;
        a.download = filename;
        a.click();
      });
    });
    this.setState({
      log: { estado: "Descarga de reporte finalizado" },
      loading: false,
    });
  };

  // Realizar el cálculo de los nodos existentes en base de datos
  // El estado calculating permite identificar el momento en que se realiza los cálculos
  _cal_all = (method) => {
    let msg = "";
    let pcc =
      this.state.search === "" ? "todos los nodos" : this._nodes_names();

    if (method === "POST") {
      msg = "Empezando cálculo de " + pcc;
    } else {
      msg = "Empezando rescritura de " + pcc;
    }
    this.setState({
      log: {
        estado: "Iniciando",
        mensaje: msg,
      },
      edited: true,
      loading: true,
      calculating: true,
      msg: "",
    });
    let path = "";
    let payload = {
      method: method,
      headers: { "Content-Type": "application/json" },
    };

    if (this.state.search === "") {
      path = SRM_API_URL + "/disp-sRemoto/disponibilidad/" + this._range_time();
    } else if (
      this.state.search !== "" &&
      this.state.report !== undefined &&
      this.state.report.reportes_nodos.length > 0
    ) {
      path =
        SRM_API_URL +
        "/disp-sRemoto/disponibilidad/nodos/" +
        this._range_time();
      payload["body"] = JSON.stringify({ nodos: this._nodes_names() });
    }

    fetch(path, payload)
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          this.setState({
            log: { msg: json.msg },
            edited: true,
            calculating: true,
            msg: json.msg,
            general_report_id: json?.report_id,
          });
        } else {
          this.setState({
            log: { error: json.msg },
            edited: true,
            msg: json.msg,
            calculating: false,
          });
        }
        this.setState({ loading: false });
      })
      .catch((error) => {
        // Dado que el cálculo puede tomar mas tiempo y causar un time-out
        let msg =
          "Ha fallado la conexión con la API de cálculo de disponibilidad";
        this.setState({ log: { error: msg }, msg: msg });
      });
    this._filter_reports(this.state.search);
  };

  onChangeDate = (iniDate: Date, endDate: Date) => {
    this.setState({ ini_date: iniDate });
    this.setState({ end_date: endDate });
  };

  render() {
    window.onkeydown = function (e) {
      if (e.keyCode === 8)
        if (e.target === document.body) {
          e.preventDefault();
        }
    };
    // <Styled styles={[styles, react_picker, bootstrap]} scoped={true}>
    return (
      <Styled
        styles={[
          styles,
          ReportCSS,
          SRCardCSS,
          SRReportCSS,
          ReactDateThemeCSS,
          ReactDateCSS,
        ]}
        scoped={false}
      >
        <div className="page-content">
          <Form.Group as={Row} className={"sc-search"}>
            <div className={"sc-search-node"}>
              <SearchSection
                buttonText={"Consultar"}
                placeholder={"Buscar nodos"}
                loading={this.state.loading}
                onChangeText={this._filter_reports}
                onClickSearch={this._search_report_now}
                onUpdateSearch={this._update_search}
              />
            </div>
            <div className="sc-date-picker">
              <DatePickSelector onChange={this.onChangeDate} />
            </div>
          </Form.Group>
          <ButtonSection
            loading={this.state.loading || this.state.calculating}
            calculateAll={this._cal_all}
            downloadExcelReport={this._download_excel_report}
            downloadTagReport={this._download_tag_report}
            updateUmbral={this._updateUmbral}
            rangeTime={this._range_time()}
          ></ButtonSection>
          <div className="div-cards">
            {this.state.report === undefined ? (
              <></>
            ) : (
              <SRGeneralReport
                report={this.state.report}
                calculating={this.state.calculating}
              />
            )}

            <div className="sc-body-cal">
              <div
                className={
                  this.state.edited ? "sc-log-changed" : "sc-log-normal"
                }
                onClick={() => {
                  this.setState({ edited: false });
                }}
              >
                <ReactJson
                  name="novedades"
                  displayObjectSize={true}
                  collapsed={true}
                  iconStyle="circle"
                  displayDataTypes={false}
                  theme="monokai"
                  src={this.state.log}
                />
              </div>
            </div>
            <div style={{ marginLeft: "15px" }}>{this._notification()}</div>

            {this.state.loading ? (
              <div></div>
            ) : (
              <div className="sc-src-details">
                <div className="subtitle-details">DETALLES DE CÁLCULO </div>
                <NodeReport
                  generalReportId={this.state.general_report_id}
                  document={this.state.document}
                  reports={this.state.filtered_reports}
                  ini_date={this.state.ini_date}
                  end_date={this.state.end_date}
                  calculating={this.state.calculating}
                  onChange={this.handle_calculation_details}
                  onFinish={this.handle_finish_calculation}
                />
              </div>
            )}
          </div>
        </div>
      </Styled>
    );
  }
}

export default SRCalDisponibilidad;
