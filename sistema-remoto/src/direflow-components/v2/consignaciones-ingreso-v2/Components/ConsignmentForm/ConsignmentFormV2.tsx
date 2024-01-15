import React from "react";
import ReactJson from "react-json-view";
import { selection } from "../../Constants/constants";
import {
  summarizeEntity,
  summarizeInstallation,
  summarizeNode,
} from "../../../../Common/V2Summarize";
import { V2ConsignmentForm } from "../../../common/V2ConsignmentForm";

interface ConsignmentFormV2Props {
  toConsignment: Object;
  selectedType: string;
  headerLabel: string;
  buttonLabel: string;
  onSubmit: Function;
}

const srcValueSelected = (value: any, selectedType: string) => {
  switch (selectedType) {
    case selection.node:
      return summarizeNode(value);
    case selection.entity:
      return summarizeEntity(value);
    case selection.installation:
      return summarizeInstallation(value);
  }
};

export const ConsignmentFormV2 = (props: ConsignmentFormV2Props) => {
  const { toConsignment, selectedType, headerLabel, buttonLabel, onSubmit } =
    props;

  if (!toConsignment) {
    return <></>;
  }

  const handleOnSubmit = (constForm: any) => {
    onSubmit(constForm, toConsignment, selectedType);
  };

  return (
    <div className="cons-form-container">
      <div className={"flex-container"}>
        <div className={"consignment-element"}>
          <ReactJson
            name="Elemento a consignar"
            indentWidth={1}
            displayObjectSize={false}
            collapsed={false}
            iconStyle="circle"
            displayDataTypes={false}
            collapseStringsAfterLength={20}
            src={srcValueSelected(toConsignment, selectedType)}
          />
        </div>
        <div className={"consignment-form"}>
          <V2ConsignmentForm
            headerLabel={headerLabel}
            buttonLabel={buttonLabel}
            onSubmit={handleOnSubmit}
          />
        </div>
      </div>
    </div>
  );
};
