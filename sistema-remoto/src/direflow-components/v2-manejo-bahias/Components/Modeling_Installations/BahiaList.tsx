import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { BahiaAdministration } from "./BahiaAdministration";
import { getDescriptionBahia } from "../../../Common/common-util";

export function BahiaList(props) {
  const { selectedInstallation, requestReload } = props;
  const { bahias } = selectedInstallation;
  console.log("BahiaList", bahias.length);

  const [bahiaSeleccionada, setBahiaSeleccionada] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, [selectedInstallation, bahias]);

  const handleRadioChange = (value) => {
    setBahiaSeleccionada(value);
  };

  const handleEdit = () => {
    setBahiaSeleccionada(null);
  };
  if (loading) return <div>Loading...</div>;

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
            requestReload={() => {
              requestReload();
            }}
          ></BahiaAdministration>
        }
      </div>
    </div>
  );
}
