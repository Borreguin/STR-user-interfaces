import React, { useEffect, useState } from "react";
import { Styled } from "direflow-component";
import styles from "./App.css";
import bootstrap from "bootstrap/dist/css/bootstrap.min.css";
import { Button, Col, Tab, Tabs } from "react-bootstrap";
import { V2SRNodesFilter } from "../../Common/FilterNodesV2/V2SRNodesFilter";
import { nameProperty, selection, typeProperty } from "./Constants/constants";
import { ConsignmentFormV2 } from "./Components/ConsignmentForm/ConsignmentFormV2";
import { getDescription, getElementId, getNameProperty } from "../common/util";
import react_picker from "react-datepicker/dist/react-datepicker.css";

export const getSelectedButtonLabel = (selectedValues: any, label: string) => {
  if (selectedValues && selectedValues[label]) {
    const name = getNameProperty(label);
    return selectedValues[label][name] + label;
  }
  return undefined;
};

export function ConsignmentManagementV2() {
  const [selectedValues, setSelectedValues] = useState({});
  const [toReload, setToReload] = useState(false);
  const [toConsignment, setToConsignment] = useState(undefined);
  const [selectedType, setSelectedType] = useState(undefined);
  const [selectedButton, setSelectedButton] = useState(undefined);
  const [description, setDescription] = useState(undefined);

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
      setDescription(
        getDescription(selectedValues[selection.node], selection.node),
      );
    }
    if (
      selectedType &&
      selectedButton !== getSelectedButtonLabel(selectedValues, selectedType)
    ) {
      setSelectedButton(getSelectedButtonLabel(selectedValues, selectedType));
      setToConsignment(selectedValues[selectedType]);
      setDescription(
        getDescription(selectedValues[selectedType], selectedType),
      );
    }
  }, [selectedValues]);

  const renderConsignmentButton = (label: string) => {
    const name = getNameProperty(label);
    if (
      selectedValues &&
      selectedValues[label] &&
      selectedValues[label][name]
    ) {
      const _selectedButton = getSelectedButtonLabel(selectedValues, label);
      const className =
        selectedButton === _selectedButton
          ? "cons-button-active"
          : "cons-button";
      return (
        <Button
          className={className}
          onClick={() => {
            setToConsignment(selectedValues[label]);
            setSelectedType(label);
            setSelectedButton(_selectedButton);
            setDescription(getDescription(selectedValues[label], label));
          }}
          active={selectedButton === _selectedButton}
        >
          {selectedValues[label][name]}
        </Button>
      );
    }
    return <></>;
  };
  const onSubmit = (
    constForm: any,
    toConsignment: any,
    selectedType: string,
  ) => {
    const element_id = getElementId(toConsignment);
    // TODO: continue here
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
          {renderConsignmentButton(selection.node)}
          {renderConsignmentButton(selection.entity)}
          {renderConsignmentButton(selection.installation)}
          <ConsignmentFormV2
            toConsignment={toConsignment}
            selectedType={selectedType}
            headerLabel={description}
            buttonLabel={"Ingresar: " + description}
            onSubmit={onSubmit}
          />
          <div>
            Los campos con (<span className="cons-mandatory">*</span>) son
            mandatorios
          </div>
        </div>
      </div>
    </Styled>
  );
}

export default ConsignmentManagementV2;
