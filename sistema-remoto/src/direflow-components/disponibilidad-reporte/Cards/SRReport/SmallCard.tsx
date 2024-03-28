import { Line } from "rc-progress";
import { Badge } from "react-bootstrap";
import ReactTooltip from "react-tooltip";
import React from "react";
import { ConsignmentModal } from "../../../v2-bahia-report/components/ConsignmentModal";

interface SmallCardProps {
  ponderacion: number;
  tipo: string;
  nombre: string;
  n_tags: number;
  n_bahias: number;
  consignaciones: Array<any>;
  disponibilidad: number;
  onNameShowModal: Function;
}

export const SmallCard = (props: SmallCardProps) => {
  const {
    ponderacion,
    tipo,
    nombre,
    n_tags,
    n_bahias,
    consignaciones,
    disponibilidad,
    onNameShowModal,
  } = props;
  const [showConsignments, setShowConsignments] = React.useState(false);
  const _tooltip = (p: number, t: number) => {
    const div_bahias = n_bahias ? "<div>Bahías: " + n_bahias + "</div>" : "";
    return (
      `<div>Ponderación: ${_format_percentage(p, 2)} %</div>` +
      div_bahias +
      `<div>Tags: ${t} </div>`
    );
  };

  const _format_percentage = (percentage: number, n: number) => {
    if (percentage === 100) {
      return "100";
    } else if (percentage < 0 || percentage == undefined) {
      return "---";
    } else {
      return "" + percentage.toFixed(n);
    }
  };

  // const handleOnClickConsignments = () => {
  //   if (n_bahias > 0 && consignaciones.length > 0) {
  //     onNameShowModal();
  //   }
  // };

  return (
    <div className="dr-utr-body">
      {consignaciones.length === 0 ? (
        <></>
      ) : (
        <ConsignmentModal
          title={`Consignaciones de ${nombre}`}
          consignments={consignaciones}
          show={showConsignments}
          onClose={() => setShowConsignments(false)}
        />
      )}
      <div className={"dr-body"}>
        <div className="dr-utr-description">
          <Line className="dr-utr-bar" percent={ponderacion * 100} />
          <div>{tipo}</div>
          <div
            className="dr-utr-label"
            data-tip={_tooltip(ponderacion * 100, n_tags)}
            data-html={true}
            onClick={() => onNameShowModal()}
          >
            {nombre}
          </div>
        </div>
        <div className="dr-utr-disp">
          {_format_percentage(disponibilidad, 2)} %
        </div>
      </div>
      <br />
      <div
        className={"dr-consignacion"}
        data-tip={"Click para ver detalles"}
        onClick={() => setShowConsignments(true)}
      >
        <Badge variant="info">{consignaciones.length} Consg.</Badge>
        <ReactTooltip />
      </div>
      <ReactTooltip />
    </div>
  );
};
