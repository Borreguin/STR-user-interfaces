import { Styled } from "direflow-component";
import React, { Component } from "react";
import { Alert, Button, Col, Tab, Tabs } from "react-bootstrap";
import styles from "./App.css";
import react_picker from "react-datepicker/dist/react-datepicker.css";
import DatosMantenimiento from "./SRConsignaciones_DatosMantenimiento";
import { to_yyyy_mm_dd_hh_mm_ss } from "../../Common/DatePicker/DateRange";
import { SRM_API_URL } from "../../../Constantes";

interface Props {
  componentTitle: string;
  sampleList: string[];
}

type selected_id = {
  utr: string | undefined;
};

type selected = {
  utr_tipo: string | undefined;
  utr_nombre: string | undefined;
};

type forma = {
  selected_id: selected_id;
  selected: selected;
  no_consignacion: string;
  fecha_inicio: Date;
  fecha_final: Date;
  detalle: string;
  responsable: string;
  descripcion_corta: string;
};

interface States {
  loading: boolean;
  forma: forma;
  active: boolean;
  log: string;
  success: boolean;
}

class ConsignacionesIngreso extends Component<Props, States> {
  /* Configuración de la página: */
  state = {
    loading: true,
    forma: {
      selected_id: { utr: undefined },
      selected: { utr_tipo: undefined, utr_nombre: undefined },
      no_consignacion: undefined,
      fecha_inicio: new Date(),
      fecha_final: new Date(),
      detalle: undefined,
      descripcion_corta: "",
      responsable:
        localStorage.getItem("userRole") +
        " | " +
        localStorage.getItem("userDisplayName"),
    },
    active: false,
    log: "",
    success: false,
  };

  // permite obtener datos del componente:
  handle_datos_mantenimiento = (forma) => {
    this.setState({ forma: forma });
    this.check_values();
  };

  // check values to let send the information
  check_values = () => {
    let valid = true;
    // check no_consignacion
    valid =
      valid &&
      this.state.forma["no_consignacion"] !== undefined &&
      this.state.forma["no_consignacion"].length >= 3;

    // check selección UTR
    valid =
      valid &&
      this.state.forma["selected_id"] !== undefined &&
      this.state.forma.selected_id["utr"] !== undefined;
    this.setState({ active: valid });
  };

  // enviar consignación:

  _send_consignacion = () => {
    let msg =
      "Desea ingresar la siguiente consignación? \n\n" +
      this.state.forma.selected.utr_tipo +
      ": \t\t\t" +
      this.state.forma.selected.utr_nombre +
      "\n" +
      "No. consignación: \t" +
      this.state.forma.no_consignacion +
      "\n" +
      "Inicio: \t\t\t\t" +
      to_yyyy_mm_dd_hh_mm_ss(this.state.forma["fecha_inicio"]) +
      "\n" +
      "Fin:    \t\t\t\t" +
      to_yyyy_mm_dd_hh_mm_ss(this.state.forma["fecha_final"]);
    let r = window.confirm(msg);
    if (r === false) return;

    let path =
      SRM_API_URL +
      "/admin-consignacion/consignacion/" +
      this.state.forma.selected_id.utr +
      "/" +
      to_yyyy_mm_dd_hh_mm_ss(this.state.forma.fecha_inicio) +
      "/" +
      to_yyyy_mm_dd_hh_mm_ss(this.state.forma.fecha_final);
    let payload = {
      elemento: this.state.forma.selected,
      no_consignacion: this.state.forma["no_consignacion"],
      detalle: {
        detalle: this.state.forma.detalle,
        descripcion_corta: this.state.forma.descripcion_corta,
      },
      responsable: this.state.forma.responsable,
    };
    fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((result) => {
        this.setState({ log: result.msg, success: result.success });
      })
      .catch(console.log);
  };

  render() {
    window.onkeydown = function (e) {
      if (e.keyCode === 8)
        if (e.target === document.body) {
          e.preventDefault();
        }
    };

    return (
      <Styled styles={[styles, react_picker]} scoped={true}>
        <div className="page-content">
          <div className="cons-container">
            <Tabs
              defaultActiveKey="dt-mte"
              id="uncontrolled-tab-example"
              transition={false}
            >
              <Tab eventKey="dt-mte" title="Datos Consignación">
                <DatosMantenimiento
                  onChange={this.handle_datos_mantenimiento}
                ></DatosMantenimiento>
              </Tab>
            </Tabs>
            <Col>
              <br></br>
              {!this.state.active ? (
                <div>
                  Los campos con (<span className="cons-mandatory">*</span>) son
                  mandatorios
                </div>
              ) : (
                <div>
                  <Button
                    variant="primary"
                    disabled={!this.state.active}
                    onClick={this._send_consignacion}
                  >
                    Ingresar consignación
                  </Button>
                  {this.state.log.length === 0 ? (
                    <></>
                  ) : (
                    <Alert
                      className="cns-info"
                      variant={this.state.success ? "success" : "warning"}
                    >
                      {this.state.log}
                    </Alert>
                  )}
                </div>
              )}
            </Col>
          </div>
        </div>
      </Styled>
    );
  }
}

export default ConsignacionesIngreso;
