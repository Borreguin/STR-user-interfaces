import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { BahiaAdministration } from "./BahiaAdministration";
import { getDescriptionBahia } from "../../../Common/common-util";

export function BahiaList(props) {
  const { selectedInstallation } = props;
  const { bahias } = selectedInstallation;

  const [bahiaSeleccionada, setBahiaSeleccionada] = useState(null);

  const handleRadioChange = (value) => {
    setBahiaSeleccionada(value);
  };

  const handleEdit = () => {
    setBahiaSeleccionada(null);
  };

  return (
    <div className={"sc-new-bahia-container"}>
      <div className={"sc-bahia-selector"}>
        <Button
          className="btn-new-bahia"
          variant="success"
          type="button"
          onClick={handleEdit}
        >
          Nueva Bahía
        </Button>

        <Form className="overflow-auto bahias-container">
          {bahias
            .sort(
              (a, b) =>
                parseFloat(getDescriptionBahia(a)) -
                parseFloat(getDescriptionBahia(b)),
            )
            .map((bahia) => (
              <Form.Check
                type="radio"
                label={getDescriptionBahia(bahia)}
                name={getDescriptionBahia(bahia)}
                defaultValue={bahia}
                checked={bahiaSeleccionada === bahia}
                onChange={() => handleRadioChange(bahia)}
                id={bahia?.document_id}
                key={bahia?.document_id}
              />
            ))}
        </Form>
      </div>
      <div className={"sc-bahia-form"}>
        {
          <BahiaAdministration
            bahia={bahiaSeleccionada}
            selectedInstalationId={selectedInstallation._id}
          ></BahiaAdministration>
        }
      </div>
    </div>
  );
}
