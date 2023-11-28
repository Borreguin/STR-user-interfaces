import React, { Component } from "react";
import { Styled } from "direflow-component";
import styles from "./App.css";
import bootstrap from "bootstrap/dist/css/bootstrap.min.css";
import { Col, Tab, Tabs } from "react-bootstrap";
import SRModelingTag from "./Components/Modeling_Tags/SRModelingTags";
import SRModelingRTU from "./Components/Modeling_Installations/SRModeling_RTUs";
import { V2SRNodesFilter } from "../Common/FilterNodesV2/V2SRNodesFilter";
import {InstallationActionContainer} from "./Components/Modeling_Installations/InstallationActionContainer";

// Pagina inicial de manejo de nodos:
class InstallationAndBahiasManagement extends Component {
  /* Configuración de la página: */
  state = {
    nodes: [],
    search: "",
    loading: true,
    filter_nodes: [],
    form: { selected: undefined, selected_id: undefined },
    active: false,
    log: "",
    success: false,
  };

  // permite manejar cambios en el filtrado de nodos
  _handle_filter_STRNodes = () => {
    // let form = this.state.form;
    // form["selected"] = selected;
    // form["selected_id"] = selected_id;
    //this.setState({ form: form });
    console.log("handle_filter_STRNodes");
  };

  render() {
    window.onkeydown = function (e) {
      if (e.keyCode === 8)
        if (e.target === document.body) {
          e.preventDefault();
        }
    };

    return (
      <Styled styles={[styles, bootstrap]} scoped={false}>
        <div className="page-content">
          <div className="cons-container">
            <Tabs
              defaultActiveKey="dt-mte"
              id="uncontrolled-tab"
              transition={false}
            >
              <Tab eventKey="dt-mte" title="Información de Instalaciones">
                <V2SRNodesFilter
                  onFinalChange={(values: any) =>
                    console.log("last change", values)
                  }
                />
              </Tab>
            </Tabs>
            <InstallationActionContainer></InstallationActionContainer>
            <Col></Col>
          </div>
        </div>
      </Styled>
    );
  }
}

export default InstallationAndBahiasManagement;
