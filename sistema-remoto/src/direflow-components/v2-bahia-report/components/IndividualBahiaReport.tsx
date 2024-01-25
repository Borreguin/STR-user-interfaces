import React from "react";
import { BahiaReport } from "../../disponibilidad-reporte/Cards/SRReport/Report";
import ReactJson from "react-json-view";
import { formatPercentage } from "../../Common/common-util";

class BahiaReportProps {
  bReport: BahiaReport;
}

export const IndividualBahiaReport = (props: BahiaReportProps) => {
  const { bReport } = props;
  const formatBReport = () => {
    const details = {
      "Tags Procesadas": bReport.numero_tags_procesadas,
      "Periodo efectivo minutos": bReport.periodo_efectivo_minutos,
      "Periodo consignado minutos":
        bReport.periodo_evaluacion_minutos - bReport.periodo_efectivo_minutos,
      "Indisp. promedio minutos": bReport.indisponibilidad_promedio_minutos,
    };
    let report = {
      Disponibilidad: formatPercentage(
        bReport.disponibilidad_promedio_porcentage,
        3,
      ),
      Voltaje: bReport.voltaje == 0 ? null : bReport.voltaje,
      Tags: bReport.numero_tags,
    };
    if (bReport.consignaciones.length > 0) {
      report["Consignaciones"] = bReport.consignaciones.length;
    }
    report["Detalles"] = details;
    return report;
  };

  return (
    <div className={"b-report"}>
      <ReactJson
        name={`${bReport.bahia_nombre}`}
        displayObjectSize={false}
        collapsed={1}
        iconStyle="circle"
        displayDataTypes={false}
        indentWidth={0}
        quotesOnKeys={false}
        src={formatBReport()}
      />
    </div>
  );
};
