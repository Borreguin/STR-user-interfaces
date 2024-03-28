import React, { useEffect, useState } from "react";
import { Styled } from "direflow-component";
import styles from "./App.css";
import bootstrap from "bootstrap/dist/css/bootstrap.min.css";
import { Button, Tab, Tabs } from "react-bootstrap";
import { V2SRNodesFilter } from "../Common/FilterNodesV2/V2SRNodesFilter";
import { ConsignmentFormV2 } from "../Common/ConsignmentFormV2/ConsignmentFormV2";
import {
  getDescription,
  getElementId,
  getNameProperty,
} from "../v2-common/util";
import react_picker from "react-datepicker/dist/react-datepicker.css";
import { insertConsignment } from "../Common/FetchData/V2SRFetchData";
import { V2ConsignmentFormValues } from "../v2-common/V2ConsignmentForm";
import {
  ConsignmentRequest,
  ElementInfo,
  v2Bahia,
  v2Node,
} from "../Common/V2GeneralTypes";
import { nameProperty, selection } from "../v2-common/constants";

export const getSelectedButtonLabel = (selectedValues: any, label: string) => {
  if (selectedValues && selectedValues[label]) {
    const name = getNameProperty(label);
    if (selectedValues[label] && selectedValues[label][name]) {
      return selectedValues[label][name] + label;
    }
    return label;
  }
  return undefined;
};

export function ConsignmentManagementV2() {
  const [selectedValues, setSelectedValues] = useState({});
  const [toReload, setToReload] = useState(false);
  const [toConsignment, setToConsignment] = useState(undefined);
  const [selectedType, setSelectedType] = useState(undefined);
  const [selectedButton, setSelectedButton] = useState(undefined);
  const [formDescription, setFormDescription] = useState(undefined);
  const [msg, setMsg] = useState(undefined);
  const [success, setSuccess] = useState(false);
  const [selectedBahias, setSelectedBahias] = useState([] as v2Bahia[]);
  const [selectedNodes, setSelectedNodes] = useState([] as v2Node[]);

  useEffect(() => {
    if (
      !selectedButton &&
      selectedValues &&
      selectedValues[selection.node] &&
      selectedValues[selection.node][nameProperty.node_name]
    ) {
      const _selectedButton = getSelectedButtonLabel(
        selectedValues,
        selection.node,
      );
      setSelectedButton(_selectedButton);
      setToConsignment(selectedValues[selection.node]);
      setSelectedType(selection.node);
      setFormDescription(
        getDescription(selectedValues[selection.node], selection.node),
      );
    }
    if (
      selectedType &&
      selectedButton !== getSelectedButtonLabel(selectedValues, selectedType)
    ) {
      setSelectedButton(getSelectedButtonLabel(selectedValues, selectedType));
      setToConsignment(selectedValues[selectedType]);
      setFormDescription(
        getDescription(selectedValues[selectedType], selectedType),
      );
    }
  }, [selectedValues]);

  const shouldRenderEntityButton = () => {
    if (
      selectedValues === undefined ||
      selectedValues === null ||
      !selectedValues[selection.entity] ||
      !selectedValues[selection.node] ||
      !selectedValues[selection.entity][nameProperty.entity_name] ||
      !selectedValues[selection.node][nameProperty.node_name]
    ) {
      return false;
    }
    return (
      selectedValues[selection.entity][nameProperty.entity_name] !==
      selectedValues[selection.node][nameProperty.node_name]
    );
  };

  const renderBahiaConsignmentButton = () => {
    const className =
      selectedButton === selection.bahia ? "cons-button-active" : "cons-button";
    return (
      <Button
        className={className}
        onClick={() => {
          setSelectedType(selection.bahia);
          setSelectedButton(selection.bahia);
          setFormDescription("Bahías a consignar");
          setToConsignment(selectedValues[selection.installation]);
        }}
        active={selectedButton === selection.bahia}
      >
        BAHIAS
      </Button>
    );
  };

  const renderConsignmentButton = (label: string) => {
    const name = getNameProperty(label);
    if (!selectedValues || !selectedValues[label]) return <></>;
    const _selectedButton = getSelectedButtonLabel(selectedValues, label);
    const className =
      selectedButton === _selectedButton ? "cons-button-active" : "cons-button";
    const description = getDescription(selectedValues[label], label);
    return (
      <Button
        className={className}
        onClick={() => {
          setToConsignment(selectedValues[label]);
          setSelectedType(label);
          setSelectedButton(_selectedButton);
          setFormDescription(description);
        }}
        active={selectedButton === _selectedButton}
      >
        {selectedValues[label][name] ? selectedValues[label][name] : name}
      </Button>
    );
  };

  const submitBahias = (constForm: V2ConsignmentFormValues) => {
    const confirm = window.confirm(
      `${constForm.no_consignacion}: \n\nSeguro que desea ingresar consignaciones para ${selectedBahias.length} bahias? \n` +
        `Inicio: ${constForm.fecha_inicio} \n` +
        `Fin: ${constForm.fecha_final} \n\n` +
        `${constForm.descripcion_corta}: \n` +
        `${constForm.detalle}`,
    );
    if (!confirm) return;
    for (let bahia of selectedBahias) {
      const element = {
        bahia_code: bahia.bahia_code,
        bahia_nombre: bahia.bahia_nombre,
        voltaje: bahia.voltaje,
        document_id: bahia.document_id,
        created: bahia.created,
      };
      submitElementConsignment(constForm, element);
    }
  };

  const submitNodes = (constForm: V2ConsignmentFormValues) => {
    const confirm = window.confirm(
      `${constForm.no_consignacion}: \n\nSeguro que desea ingresar consignación nacional de ${selectedNodes.length} nodos? \n` +
        `Inicio: ${constForm.fecha_inicio} \n` +
        `Fin: ${constForm.fecha_final} \n\n` +
        `${constForm.descripcion_corta}: \n` +
        `${constForm.detalle}`,
    );
    if (!confirm) return;
    for (let node of selectedNodes) {
      const element = {
        _id: node._id,
        document_id: node.document_id,
        tipo: node.tipo,
        nombre: node.nombre,
        n_bahias: node.n_bahias,
        n_tags: node.n_tags,
        n_instalaciones: node.n_instalaciones,
        actualizado: node.actualizado,
        activado: node.activado,
      };
      submitElementConsignment(constForm, element);
    }
  };

  const onSubmit = (constForm: V2ConsignmentFormValues) => {
    switch (selectedButton) {
      case selection.bahia:
        return submitBahias(constForm);
      case selection.nodes:
        return submitNodes(constForm);
      default:
        return submitElementConsignment(constForm, toConsignment);
    }
  };

  const submitElementConsignment = (
    constForm: V2ConsignmentFormValues,
    element: any,
  ) => {
    const element_id = getElementId(element);
    const iniDate = constForm.fecha_inicio;
    const endDate = constForm.fecha_final;
    const elementInfo: ElementInfo = {
      detalle: constForm.detalle,
      descripcion_corta: constForm.descripcion_corta,
      consignment_type: "Normal",
      element: element,
    };
    const body: ConsignmentRequest = {
      no_consignacion: constForm.no_consignacion,
      responsable: constForm.responsable,
      fecha_inicio: iniDate,
      fecha_final: endDate,
      element_info: elementInfo,
    };
    setMsg("Enviando consignación...");
    insertConsignment(element_id, iniDate, endDate, body).then((response) => {
      setMsg(response.msg);
      setSuccess(response.success);
    });
  };

  const buttonLabel = () => {
    if (selectedButton === selection.bahia) {
      return `Ingresar en [${selectedBahias.length}] bahías seleccionadas`;
    }
    return "Ingresar en " + formDescription;
  };

  return (
    <Styled styles={[styles, bootstrap, react_picker]} scoped={true}>
      <div className="page-content">
        <div className="cons-container">
          <Tabs
            defaultActiveKey="dt-mte"
            id="uncontrolled-tab"
            transition={false}
          >
            <Tab eventKey="dt-mte" title="Ingreso de consignaciones">
              <V2SRNodesFilter
                onFinalChange={(values: any) => {
                  setSelectedValues(values);
                }}
                toReload={toReload}
                onFinishReload={() => setToReload(false)}
              />
            </Tab>
          </Tabs>
          {renderConsignmentButton(selection.nodes)}
          {renderConsignmentButton(selection.node)}
          {shouldRenderEntityButton() &&
            renderConsignmentButton(selection.entity)}
          {renderConsignmentButton(selection.installation)}
          {renderBahiaConsignmentButton()}
          <div>
            <ConsignmentFormV2
              toConsignment={toConsignment}
              selectedType={selectedType}
              headerLabel={formDescription}
              buttonLabel={buttonLabel()}
              msg={msg}
              onSubmit={onSubmit}
              onBahiaSelection={(bahias: v2Bahia[]) =>
                setSelectedBahias(bahias)
              }
              onNodeSelection={(nodes: v2Node[]) => setSelectedNodes(nodes)}
            />
          </div>
        </div>
      </div>
    </Styled>
  );
}

export default ConsignmentManagementV2;
