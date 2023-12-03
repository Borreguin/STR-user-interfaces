import React, {Component, useRef, useState} from "react";
import {Styled} from "direflow-component";
import styles from "./App.css";
import bootstrap from "bootstrap/dist/css/bootstrap.min.css";
import {Col, Tab, Tabs} from "react-bootstrap";
import {V2SRNodesFilter} from "../Common/FilterNodesV2/V2SRNodesFilter";
import {InstallationActionContainer} from "./Components/Modeling_Installations/InstallationActionContainer";

export function InstallationAndBahiasManagement() {

    const [selectedValues, setSelectedValues] = useState({})
    const [toReload, setToReload] = useState(false)
    const requestReload = () => {
        console.log('InstallationAndBahiasManagement');
        setToReload(true);
    }

    return (
        <Styled styles={[styles, bootstrap]} scoped={false}>
            <div className="page-content">
                <div className="cons-container">
                    <Tabs
                        defaultActiveKey="dt-mte"
                        id="uncontrolled-tab"
                        transition={false}
                    >\
                        <Tab eventKey="dt-mte" title="Información de Instalaciones">
                            <V2SRNodesFilter
                                onFinalChange={(values: any) => {
                                    setSelectedValues(values)
                                    console.log(values)
                                }}
                                toReload={toReload}
                                onFinishReload={() => setToReload(false)}
                            />
                        </Tab>
                    </Tabs>
                    <InstallationActionContainer requestReload={() => {
                        setToReload(true)
                    }} selectedValues={selectedValues}/>
                    <Col></Col>
                </div>
            </div>
        </Styled>
    );
}

export default InstallationAndBahiasManagement;