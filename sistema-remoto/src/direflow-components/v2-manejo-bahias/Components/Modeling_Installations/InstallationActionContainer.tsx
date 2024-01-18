import {Tab, Tabs} from "react-bootstrap";
import React from "react";
import {InstallationEdit} from "./InstallationEdit";
import {InstallationRemove} from "./InstallationRemove";
import {InstallationCreate} from "./InstallationCreate";
import {BahiaList} from "./BahiaList";

export function InstallationActionContainer(props: any) {
    const {selectedValues, requestReload} = props;

    return (
        <Tabs
            defaultActiveKey="create-installation"
            id="uncontrolled-tab-example"
            className="mb-3"
        >
            <Tab eventKey="create-installation" title="Crear">
                <InstallationCreate requestReload={requestReload}
                                    selectedEntity={selectedValues.selectedEntity}></InstallationCreate>
            </Tab>
            <Tab eventKey="edit-installation" title="Editar">
                <InstallationEdit requestReload={requestReload}
                                  selectedInstallation={selectedValues.selectedInstallation}></InstallationEdit>
            </Tab>
            <Tab eventKey="remove-installation" title="Remover">
                <InstallationRemove requestReload={requestReload}
                                    selectedEntityId={selectedValues?.selectedEntity?.id_entidad}
                                    selectedInstallation={selectedValues.selectedInstallation}></InstallationRemove>
            </Tab>
            <Tab eventKey="admin-bahias" title="Administrar Bahias">
                {selectedValues?.selectedInstallation && <BahiaList requestReload={requestReload}
                           selectedInstallation={selectedValues.selectedInstallation}></BahiaList>}
            </Tab>
        </Tabs>
    );
}