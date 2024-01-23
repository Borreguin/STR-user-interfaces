import { Line } from "rc-progress";
import { Badge } from "react-bootstrap";
import ReactTooltip from "react-tooltip";
import React from "react";

interface SmallCardProps {
  ponderacion: number;
  tipo: string;
  nombre: string;
  n_tags: number;
  n_bahias: number;
  n_consignaciones: number;
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
    n_consignaciones,
    disponibilidad,
    onNameShowModal,
  } = props;

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

  return (
    <div className="dr-utr-body">
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
      <div className={"dr-consignacion"}>
        <Badge variant="info">{n_consignaciones} Consg.</Badge>
      </div>

      <ReactTooltip />
    </div>
  );
};
