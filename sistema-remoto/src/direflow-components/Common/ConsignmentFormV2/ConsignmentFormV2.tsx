import React from "react";
import ReactJson from "react-json-view";
import { selection } from "../../v2-common/constants";
import {
  summarizeEntity,
  summarizeInstallation,
  summarizeNode,
} from "../V2Summarize";
import { V2ConsignmentForm } from "../../v2-common/V2ConsignmentForm";
import { BahiaList } from "../../v2-manejo-bahias/Components/Modeling_Installations/BahiaList";
import { BahiaChecker } from "../BahiaChecher/BahiaChecker";
import { v2Bahia } from "../V2GeneralTypes";

interface ConsignmentFormV2Props {
  toConsignment: Object;
  selectedType: string;
  headerLabel: string;
  buttonLabel: string;
  onSubmit: Function;
  onBahiaSelection?: Function;
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
    onSubmit,
    onBahiaSelection,
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

  const onRequestReload = () => {
    console.log("ConsignmentFormV2: onRequestReload");
  };

  return (
    <div className="cons-form-container">
      <div className={"flex-container"}>
        <div className={"consignment-element"}>
          {selectedType === selection.bahia ? (
            <BahiaChecker
              bahias={toConsignment["bahias"]}
              onSelection={(bahias: v2Bahia[]) =>
                handleOnBahiaSelection(bahias)
              }
            ></BahiaChecker>
          ) : (
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
          )}
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
        </div>
      </div>
    </div>
  );
};
