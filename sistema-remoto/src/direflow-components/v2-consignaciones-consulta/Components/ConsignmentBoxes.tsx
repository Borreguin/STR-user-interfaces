import { Button, Card, CardGroup } from "react-bootstrap";
import React from "react";
import { ConsignmentKeyValue } from "./ConsignmentPanel";
import { Consignment } from "../../Common/GeneralTypes";
import { deleteConsignment } from "../../Common/FetchData/V2SRFetchData";
import { ConsignmentEdition } from "./ConsignmentEdition";

interface ConsignmentBoxesProps {
  consignments: ConsignmentKeyValue;
  onReload: Function;
}

interface ConsignmentBoxProps {
  description: string;
  consignacion: Consignment;
  onEdit: Function;
  onReload: Function;
}

const ConsignmentBox = (props: ConsignmentBoxProps) => {
  const { description, consignacion, onEdit, onReload } = props;
  const [loading, setLoading] = React.useState(false);

  const onDelete = () => {
    setLoading(true);
    const element_id = consignacion.detalle.element.document_id;
    deleteConsignment(element_id, consignacion.id_consignacion).then(() => {
      setLoading(false);
      onReload();
    });
  };

  return (
    <Card.Header key={consignacion.fecha_inicio} className="consignacion_block">
      <div className="consignacion-title">
        <b>{consignacion.no_consignacion}</b>
      </div>
      <div className="consignacion-title">
        <b>{description}</b>
      </div>
      <div className="consg_descrip">
        <div className="consignacion_label">{consignacion.fecha_inicio}</div>
        <div className="consignacion_label">{consignacion.fecha_final}</div>
        <div className="consignacion_label">{consignacion.responsable}</div>
      </div>
      <div className="consignacion_buttons">
        <Button
          variant="outline-info"
          disabled={loading}
          onClick={() => onEdit()}
        >
          Editar
        </Button>
        <Button
          variant="outline-danger"
          disabled={loading}
          onClick={() => onDelete()}
        >
          Eliminar
        </Button>
      </div>
    </Card.Header>
  );
};

export const ConsignmentBoxes = (props: ConsignmentBoxesProps) => {
  const { consignments, onReload } = props;
  const [showModal, setShowModal] = React.useState(false);
  const [consignmentToEdit, setConsignmentToEdit] = React.useState(
    {} as Consignment,
  );
  const onEditConsignment = (consignment: Consignment) => {
    setShowModal(true);
    setConsignmentToEdit(consignment);
  };

  const renderConsignments = () => {
    let components = [];
    for (const [description, consArray] of Object.entries(consignments)) {
      for (const consignment of consArray) {
        const comp = (
          <ConsignmentBox
            key={consignment.id_consignacion}
            description={description}
            consignacion={consignment}
            onEdit={() => onEditConsignment(consignment)}
            onReload={() => onReload()}
          />
        );
        components.push(comp);
      }
    }
    return components;
  };
  return (
    <CardGroup className="tab-container">
      {renderConsignments()}
      <ConsignmentEdition
        show={showModal}
        onHide={() => setShowModal(false)}
        consignmentToEdit={consignmentToEdit}
        onReload={() => onReload()}
      />
    </CardGroup>
  );
};
