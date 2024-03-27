import { EntityReport } from "./Report";
import { Badge } from "react-bootstrap";
import { ConsignmentModal } from "../../../v2-bahia-report/components/ConsignmentModal";
import { formatPercentage } from "../../../Common/common-util";
import React, { useEffect } from "react";
import { Consignment } from "../../../Common/GeneralTypes";

type ComponentProps = {
  entity: EntityReport;
  onConsignmentClick: Function;
};

export const ConsignmentsAndPercentage = (props: ComponentProps) => {
  const { entity, onConsignmentClick } = props;
  const [consignments, setConsignments] = React.useState<Array<Consignment>>(
    [],
  );
  const [showConsignments, setShowConsignments] = React.useState(false);

  useEffect(() => {
    const _consignments =
      entity.consignaciones?.length > 0 ? entity.consignaciones : [];
    for (const iConsignment of entity.consignaciones_internas) {
      const index = _consignments.findIndex(
        (consignment) =>
          consignment.id_consignacion === iConsignment.id_consignacion,
      );
      if (index === -1) {
        _consignments.push(iConsignment);
      }
    }
    setConsignments(_consignments);
  }, []);

  return (
    <div className="dr-cons-perc">
      {consignments.length > 0 ? (
        <div>
          <Badge
            variant="info"
            className="dr-cons-badge"
            onClick={() => {
              setShowConsignments(true);
            }}
          >
            {"Consg. " + consignments.length}
          </Badge>
          <ConsignmentModal
            title={`Consignaciones de ${entity.entidad_tipo} ${entity.entidad_nombre}`}
            consignments={consignments}
            show={showConsignments}
            onClose={() => {
              setShowConsignments(false);
              onConsignmentClick();
            }}
          />
        </div>
      ) : (
        <></>
      )}
      <span className="dr-entity-disp">
        {formatPercentage(
          entity.disponibilidad_promedio_ponderada_porcentage,
          3,
        ) + " %"}
      </span>
    </div>
  );
};
