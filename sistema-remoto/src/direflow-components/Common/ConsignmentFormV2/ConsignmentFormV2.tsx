import React from "react";
import ReactJson from "react-json-view";
import { selection } from "../../v2-common/constants";
import {
  summarizeEntity,
  summarizeInstallation,
  summarizeNode,
} from "../V2Summarize";
import { V2ConsignmentForm } from "../../v2-common/V2ConsignmentForm";
import { BahiaChecker } from "../BahiaChecher/BahiaChecker";
import { v2Bahia, v2Node } from "../V2GeneralTypes";
import { Alert } from "react-bootstrap";
import { NodeChecker } from "../NodeChecher/NodeChecker";

interface ConsignmentFormV2Props {
  toConsignment: Object;
  selectedType: string;
  headerLabel: string;
  buttonLabel: string;
  msg: string;
  onSubmit: Function;
  onBahiaSelection?: Function;
  onNodeSelection?: Function;
}

const srcValueSelected = (value: any, selectedType: string) => {
  switch (selectedType) {
    case selection.node:
      return summarizeNode(value, false);
    case selection.entity:
      return summarizeEntity(value, false);
    case selection.installation:
      return summarizeInstallation(value, false);
  }
};

export const ConsignmentFormV2 = (props: ConsignmentFormV2Props) => {
  const {
    toConsignment,
    selectedType,
    headerLabel,
    buttonLabel,
    msg,
    onSubmit,
    onBahiaSelection,
    onNodeSelection,
  } = props;

  if (!toConsignment) {
    return <></>;
  }

  const handleOnSubmit = (constForm: any) => {
    onSubmit(constForm, srcValueSelected(toConsignment, selectedType));
  };

  const handleOnBahiaSelection = (bahias: v2Bahia[]) => {
    onBahiaSelection(bahias);
  };

  const handleOnNodeSelection = (nodes: v2Node[]) => {
    if (onNodeSelection) {
      onNodeSelection(nodes);
    }
  };
  const selectComponent = (selectedType: string) => {
    switch (selectedType) {
      case selection.bahia:
        return (
          <BahiaChecker
            bahias={toConsignment["bahias"]}
            onSelection={(bahias: v2Bahia[]) => handleOnBahiaSelection(bahias)}
          />
        );
      case selection.nodes:
        return (
          <NodeChecker
            nodes={toConsignment}
            onSelection={(nodes: v2Node[]) => handleOnNodeSelection(nodes)}
          ></NodeChecker>
        );

      default:
        return (
          <ReactJson
            name="Elemento a consignar"
            indentWidth={0}
            displayObjectSize={false}
            collapsed={false}
            iconStyle="circle"
            displayDataTypes={false}
            quotesOnKeys={false}
            collapseStringsAfterLength={20}
            src={srcValueSelected(toConsignment, selectedType)}
          />
        );
    }
  };

  return (
    <div className="cons-form-container">
      <div className={"flex-container"}>
        <div className={"consignment-element"}>
          {selectComponent(selectedType)}
        </div>
        <div className={"consignment-form"}>
          <V2ConsignmentForm
            headerLabel={headerLabel}
            buttonLabel={buttonLabel}
            onSubmit={handleOnSubmit}
          />
          <div>
            Los campos con (<span className="cons-mandatory">*</span>) son
            mandatorios
          </div>
          {!msg ? <></> : <Alert variant={"info"}>{msg}</Alert>}
        </div>
      </div>
    </div>
  );
};
