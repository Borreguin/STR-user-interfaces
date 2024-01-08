import { Styled } from "direflow-component";
import React, { Component } from "react";
import { Col, Tab, Tabs } from "react-bootstrap";
import DatosConsultar from "./SRConsignaciones_ConsultarForm";
import styles from "./App.css";
import react_picker from "react-datepicker/dist/react-datepicker.css";

interface Props {
  componentTitle: string;
  sampleList: string[];
}

type selected_id = {
  utr: string | undefined;
};

type forma = {
  selected_id: selected_id;
  no_consignacion: string;
};

interface States {
  loading: boolean;
  forma: forma;
  active: boolean;
  log: string;
  success: boolean;
}

class ConsignacionesConsulta extends Component<Props, States> {
  /* Configuración de la página: */
  state = {
    loading: true,
    forma: {
      selected_id: { utr: undefined },
      no_consignacion: undefined,
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
      this.state.forma.no_consignacion !== undefined &&
      this.state.forma.no_consignacion.length >= 3;

    // check selección UTR
    valid =
      valid &&
      this.state.forma.selected_id !== undefined &&
      this.state.forma.selected_id.utr !== undefined;
    this.setState({ active: valid });
  };

  // enviar consignación:

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
              <Tab eventKey="dt-mte" title="Datos de consignación a consultar">
                <DatosConsultar
                  onChange={this.handle_datos_mantenimiento}
                ></DatosConsultar>
              </Tab>
            </Tabs>
            <Col>
              <br></br>
            </Col>
          </div>
        </div>
      </Styled>
    );
  }
}

export default ConsignacionesConsulta;
