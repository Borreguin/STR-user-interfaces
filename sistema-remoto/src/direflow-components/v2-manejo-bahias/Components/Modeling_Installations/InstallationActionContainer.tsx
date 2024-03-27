import { Tab, Tabs } from "react-bootstrap";
import React from "react";
import { InstallationEdit } from "./InstallationEdit";
import { InstallationRemove } from "./InstallationRemove";
import { InstallationCreate } from "./InstallationCreate";
import { BahiaList } from "./BahiaList";
import { TagManager } from "../../../Common/TagManager/TagManager";

export function InstallationActionContainer(props: any) {
  const { selectedValues, requestReload } = props;
  return (
    <Tabs
      defaultActiveKey="admin-tags"
      id="uncontrolled-installation-tab"
      className="mb-3"
      transition={false}
    >
      <Tab eventKey="create-installation" title="Crear">
        <InstallationCreate
          requestReload={requestReload}
          selectedEntity={selectedValues.selectedEntity}
        ></InstallationCreate>
      </Tab>
      <Tab eventKey="edit-installation" title="Editar">
        {selectedValues.selectedInstallation && (
          <InstallationEdit
            requestReload={requestReload}
            selectedInstallation={selectedValues.selectedInstallation}
          ></InstallationEdit>
        )}
      </Tab>
      <Tab eventKey="remove-installation" title="Remover">
        {selectedValues.selectedInstallation && (
          <InstallationRemove
            requestReload={requestReload}
            selectedEntityId={selectedValues?.selectedEntity?.id_entidad}
            selectedInstallation={selectedValues.selectedInstallation}
          ></InstallationRemove>
        )}
      </Tab>
      <Tab eventKey="admin-bahias" title="Administrar Bahias">
        {selectedValues?.selectedInstallation && (
          <BahiaList
            requestReload={requestReload}
            selectedInstallation={selectedValues.selectedInstallation}
          ></BahiaList>
        )}
      </Tab>
      <Tab eventKey="admin-tags" title="Administrar Tags">
        {selectedValues?.selectedInstallation && (
          <TagManager
            selectedValues={selectedValues}
            requestReload={requestReload}
          ></TagManager>
        )}
      </Tab>
    </Tabs>
  );
}
