import {Tab, Tabs} from "react-bootstrap";
import React from "react";
import {InstallationEdit} from "./InstallationEdit";
import {InstallationRemove} from "./InstallationRemove";
import {InstallationCreate} from "./InstallationCreate";

export function InstallationActionContainer() {
    return (
        <Tabs
            defaultActiveKey="edit-installation"
            id="uncontrolled-tab-example"
            className="mb-3"
        >
            <Tab eventKey="create-installation" title="Crear">
                <InstallationCreate></InstallationCreate>
            </Tab>
            <Tab eventKey="edit-installation" title="Edit">
                <InstallationEdit></InstallationEdit>
            </Tab>
            <Tab eventKey="remove-installation" title="Remover" >
                <InstallationRemove></InstallationRemove>
            </Tab>
        </Tabs>
    );
}