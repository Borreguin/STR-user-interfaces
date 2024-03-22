import React, { useEffect } from "react";
import { Form } from "react-bootstrap";
import { v2Bahia } from "../V2GeneralTypes";
import { getDescriptionBahia } from "../common-util";

type BahiaCheckerProps = {
  bahias: v2Bahia[];
  onSelection: Function;
};
export const BahiaChecker = (props: BahiaCheckerProps) => {
  const { bahias, onSelection } = props;
  const [bahiasSeleccionadas, setBahiasSeleccionadas] = React.useState({});

  useEffect(() => {
    let bahiasArray = Object.values(bahiasSeleccionadas);
    bahiasArray = bahiasArray.filter((bahia) => bahia !== undefined);
    onSelection(bahiasArray);
  }, [bahiasSeleccionadas]);

  const onSelectionChange = (bahia: v2Bahia) => {
    const isSelected = bahiasSeleccionadas[bahia.document_id] !== undefined;
    if (isSelected) {
      setBahiasSeleccionadas({
        ...bahiasSeleccionadas,
        [bahia.document_id]: undefined,
      });
    } else {
      setBahiasSeleccionadas({
        ...bahiasSeleccionadas,
        [bahia.document_id]: bahia,
      });
    }
  };

  return (
    <Form className="overflow-auto bahias-container">
      {bahias
        .sort(
          (a, b) =>
            parseFloat(getDescriptionBahia(a)) -
            parseFloat(getDescriptionBahia(b)),
        )
        .map((bahia) => (
          <Form.Check
            type="checkbox"
            label={getDescriptionBahia(bahia)}
            name={getDescriptionBahia(bahia)}
            //defaultValue={bahia}
            checked={bahiasSeleccionadas[bahia.document_id] !== undefined}
            onChange={() => onSelectionChange(bahia)}
            id={bahia?.document_id}
            key={bahia?.document_id}
          />
        ))}
    </Form>
  );
};
