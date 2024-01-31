import { Modal } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import { Consignment, ConsignmentRequest } from "../../Common/GeneralTypes";
import {
  V2ConsignmentForm,
  V2ConsignmentFormValues,
} from "../../v2-common/V2ConsignmentForm";
import { getElementValues } from "../../Common/common-util";
import { editConsignment } from "../../Common/FetchData/V2SRFetchData";

interface ConsignmentEditionProps {
  show: boolean;
  onHide: Function;
  consignmentToEdit: Consignment;
  onReload: Function;
}
export const ConsignmentEdition = (props: ConsignmentEditionProps) => {
  const { show, onHide, consignmentToEdit, onReload } = props;
  const [toShow, setToShow] = useState(show);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setToShow(show);
  }, [show]);

  const getHeaderLabel = () => {
    let name = "";
    let type = "";
    if (consignmentToEdit?.detalle?.element !== undefined) {
      name = getElementValues(consignmentToEdit.detalle.element).name;
      type = getElementValues(consignmentToEdit.detalle.element).type;
    }
    return `${type} ${name}`;
  };

  const getInitialValues = () => {
    return {
      no_consignacion: consignmentToEdit.no_consignacion,
      fecha_inicio: consignmentToEdit.fecha_inicio,
      fecha_final: consignmentToEdit.fecha_final,
      detalle: consignmentToEdit.detalle.detalle,
      descripcion_corta: consignmentToEdit.detalle.descripcion_corta,
      responsable: consignmentToEdit.responsable,
    };
  };

  const onEditConsignment = (consForm: V2ConsignmentFormValues) => {
    setLoading(true);
    const consignmentRequest: ConsignmentRequest = {
      no_consignacion: consForm.no_consignacion,
      fecha_inicio: consForm.fecha_inicio,
      fecha_final: consForm.fecha_final,
      responsable: consForm.responsable,
      element_info: {
        detalle: consForm.detalle,
        descripcion_corta: consForm.descripcion_corta,
        element: consignmentToEdit.detalle.element,
        consignment_type: "Normal",
      },
    };
    editConsignment(
      consignmentToEdit.detalle.element.document_id,
      consignmentToEdit.id_consignacion,
      consignmentRequest,
    ).then(() => {
      setLoading(false);
      onReload();
      onHide();
    });
  };

  return (
    <Modal
      show={toShow}
      onHide={() => {
        setToShow(!toShow);
        onHide();
      }}
      animation={false}
      size="lg"
    >
      <Modal.Header translate={"false"} closeButton>
        <Modal.Title>Editar consignación</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {consignmentToEdit?.detalle?.element !== undefined && !loading && (
          <V2ConsignmentForm
            headerLabel={getHeaderLabel()}
            buttonLabel={`Editar consignación: ${getHeaderLabel()}`}
            onSubmit={(consForm: V2ConsignmentFormValues) =>
              onEditConsignment(consForm)
            }
            initialValues={getInitialValues()}
          />
        )}
      </Modal.Body>
    </Modal>
  );
};
