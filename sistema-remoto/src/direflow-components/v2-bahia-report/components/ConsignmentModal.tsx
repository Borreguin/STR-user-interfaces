import React from "react";
import { Card, Form, Modal } from "react-bootstrap";
import { Consignment } from "../../Common/GeneralTypes";
import { ConsignmentCard } from "../../disponibilidad-reporte/Cards/CardConsignment/ConsignmentCard";

type ConsignacionModalProps = {
  show: boolean;
  title: string;
  onClose: Function;
  consignments: Array<Consignment>;
};

export const ConsignmentModal = (props: ConsignacionModalProps) => {
  const { show, onClose, consignments, title } = props;
  const renderConsignments = () => {
    return consignments.map((c, ix) => (
      <ConsignmentCard key={ix} consignment={c}></ConsignmentCard>
    ));
  };

  return (
    <Modal show={show} onHide={() => onClose()} animation={false} size="lg">
      <Modal.Header translate="true" closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{renderConsignments()}</Modal.Body>
    </Modal>
  );
};
