import { Styled } from "direflow-component";
import React, { useState } from "react";
import { Tab, Tabs } from "react-bootstrap";
import styles from "./App.css";
import react_picker from "react-datepicker/dist/react-datepicker.css";
import { V2SRNodesFilter } from "../Common/FilterNodesV2/V2SRNodesFilter";
import { ConsignmentPanel } from "./Components/ConsignmentPanel";

const ConsignmentsViewV2 = () => {
  const [selectedValues, setSelectedValues] = useState({
    selectedNode: undefined,
    selectedEntity: undefined,
    selectedInstallation: undefined,
  });
  const [toReload, setToReload] = useState(false);

  return (
    <Styled styles={[styles, react_picker]} scoped={false}>
      <div className="page-content">
        <div className="cons-container">
          <Tabs
            defaultActiveKey="dt-mte"
            id="uncontrolled-tab-example"
            transition={false}
          >
            <Tab eventKey="dt-mte" title="Datos de consignación a consultar">
              <V2SRNodesFilter
                onFinalChange={(values: any) => {
                  setSelectedValues(values);
                }}
                toReload={toReload}
                onFinishReload={() => setToReload(false)}
              />
              <ConsignmentPanel selectedValues={selectedValues} />
            </Tab>
          </Tabs>
        </div>
      </div>
    </Styled>
  );
};

export default ConsignmentsViewV2;
