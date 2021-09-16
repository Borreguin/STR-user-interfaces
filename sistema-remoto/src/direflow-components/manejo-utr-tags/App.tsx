import React, { Component } from "react";
import { Styled } from "direflow-component";
import styles from "./App.css";
import bootstrap from 'bootstrap/dist/css/bootstrap.min.css';
import { Col, Tab, Tabs } from "react-bootstrap";
import FilterSTRNodes from "../Common/FilterNodes/FilterSTRNodes";
import SRModelingTag from "./Components/Modeling_Tags/SRModelingTags";
import SRModelingRTU from "./Components/Modeling_RTUs/SRModeling_RTUs";
import react_bootstrap from "../../../public/bootstrap.4.3.1.min.css"



// Pagina inicial de manejo de nodos:
class UTRandTagsManagement extends Component {
  /* Configuración de la página: */
  state = {
    nodes: [],
    search: "",
    loading: true,
    filter_nodes: [],
    forma: {selected: undefined, selected_id: undefined},
    active: false,
    log: "",
    success: false,
  };

  // permite manejar el sideBar pinned or toggle
  handle_onClickBtnPin = (btnPin) => {
    this.setState({ pinned: btnPin });
  };

  // permite manejar cambios en el filtrado de nodos
  _handle_filter_STRNodes = (selected, selected_id) => {
    let forma = this.state.forma;
    forma["selected"] = selected;
    forma["selected_id"] = selected_id;
    this.setState({ forma: forma });
  };

  render() {
    window.onkeydown = function (e) {
      if (e.keyCode === 8)
        if (e.target === document.body) {
          e.preventDefault();
        }
    };

    return (
      <Styled styles={[styles, bootstrap]} scoped={ false}>
        <div className="page-content">
          <div className="cons-container">
            <Tabs
              defaultActiveKey="dt-mte"
              id="uncontrolled-tab"
              transition={false}
            >
              <Tab eventKey="dt-mte" title="Información de UTR y Tags">
                <FilterSTRNodes onChange={this._handle_filter_STRNodes} />
              </Tab>
            </Tabs>
            <Tabs
              defaultActiveKey="dt-entidad"
              id="uncontrolled-tab-mod"
              transition={false}
              variant="pills"
            >
              {this.state.forma["selected"] === undefined ||
              this.state.forma["selected"]["entidad_nombre"] === undefined ? (
                <></>
              ) : (
                <Tab
                  eventKey="dt-entidad"
                  title={
                    "Administrar UTRs en " +
                    this.state.forma.selected["entidad_tipo"] +
                    ": " +
                    this.state.forma.selected["entidad_nombre"]
                  }
                >
                  <SRModelingRTU
                    selected={this.state.forma.selected}
                    selected_id={this.state.forma.selected_id}
                  />
                </Tab>
              )}
              {this.state.forma["selected"] === undefined ||
              this.state.forma["selected"]["utr_nombre"] === undefined ? (
                <></>
              ) : (
                <Tab
                  eventKey="dt-rtu"
                  title={
                    "Administrar Tags en " +
                    this.state.forma.selected["utr_tipo"] +
                    ": " +
                    this.state.forma.selected["utr_nombre"]
                  }
                >
                  <SRModelingTag
                    selected={this.state.forma.selected}
                    selected_id={this.state.forma.selected_id}
                  />
                </Tab>
              )}
            </Tabs>
            <Col></Col>
          </div>
        </div>
      </Styled>
    );
  }
}

export default UTRandTagsManagement;
