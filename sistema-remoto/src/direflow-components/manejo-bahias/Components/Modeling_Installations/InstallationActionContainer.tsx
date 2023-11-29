import {Tab, Tabs} from "react-bootstrap";
import React from "react";
import {InstallationEdit} from "./InstallationEdit";
import {InstallationRemove} from "./InstallationRemove";
import {InstallationCreate} from "./InstallationCreate";

export function InstallationActionContainer(props: any) {
    const {selectedValues} = props;

    return (
        <Tabs
            defaultActiveKey="create-installation"
            id="uncontrolled-tab-example"
            className="mb-3"
        >
            <Tab eventKey="create-installation" title="Crear">
                <InstallationCreate selectedEntity={selectedValues.selectedEntity}></InstallationCreate>
            </Tab>
            <Tab eventKey="edit-installation" title="Editar">
                <InstallationEdit></InstallationEdit>
            </Tab>
            <Tab eventKey="remove-installation" title="Remover" >
                <InstallationRemove></InstallationRemove>
            </Tab>
        </Tabs>
    );
}