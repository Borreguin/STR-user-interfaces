import React, { useEffect } from "react";
import {
  EntityReport,
  InstallationReport,
} from "../../disponibilidad-reporte/Cards/SRReport/Report";
import { Card, Col, Form } from "react-bootstrap";
import { SelectOption } from "../../Common/FilterNodesV2/model";
import { RenderSelection } from "../../Common/FilterNodesV2/TypeNameSelector";
import ReactJson from "react-json-view";
import { DateRange } from "../../Common/V2GeneralTypes";
import { IndividualBahiaReport } from "./IndividualBahiaReport";
import { formatPercentage } from "../../Common/common-util";

interface BahiaReportProps {
  dateRange: DateRange;
  eReport: EntityReport;
  iReport: InstallationReport;
  document_report_id: string;
}
export const BahiaContainerReport = (props: BahiaReportProps) => {
  const { document_report_id, eReport, iReport, dateRange } = props;
  const [selectedIReport, setSelectedIReport] =
    React.useState<InstallationReport>(iReport);
  const [selectedIid, setSelectedIid] =
    React.useState<string>(document_report_id);
  const [selectedOption, setSelectedOption] =
    React.useState<SelectOption>(undefined);
  const [options, setOptions] = React.useState<SelectOption[]>([]);

  useEffect(() => {
    filterInstallationReport();
    setOptions(createOptions());
  }, []);

  useEffect(() => {
    filterInstallationReport();
  }, [selectedIid]);

  const filterInstallationReport = () => {
    const _iReport = eReport.reportes_instalaciones.find((i) => {
      return i.document_id === selectedIid;
    });
    if (_iReport === undefined) return;
    setSelectedIReport(_iReport);
    setSelectedOption({ id: _iReport.document_id, value: _iReport.nombre });
    console.log("filterInstallationReport: ", _iReport);
  };

  const createOptions = () => {
    return eReport.reportes_instalaciones.map((i) => {
      return { id: i.document_id, value: i.nombre };
    });
  };

  const formatIReport = () => {
    return {
      [selectedIReport.tipo]: selectedIReport.nombre,
      "Disponibilidad promedio": formatPercentage(
        selectedIReport.disponibilidad_promedio_porcentage,
        3,
      ),
      Ponderacion: formatPercentage(selectedIReport.ponderacion, 3),
      "Bahias procesadas": selectedIReport.bahia_details.length,
      "Tags procesadas": selectedIReport.numero_tags_procesadas,
      "Consignaciones instalación": selectedIReport.consignaciones.length,
      "Consignaciones bahias": selectedIReport.numero_consignaciones_internas,
      "Indisp. promedio minutos":
        selectedIReport.indisponibilidad_promedio_minutos,
      "Periodo evaluación minutos": selectedIReport.periodo_evaluacion_minutos,
      "Periodo efectivo minutos": selectedIReport.periodo_efectivo_minutos,
      "Periodo consignado a nivel instalación minutos":
        selectedIReport.consignaciones_acumuladas_minutos,
      Nota: selectedIReport.nota,
    };
  };

  return (
    <div className={"i-report-container"}>
      <Card>
        <Card.Header className={"custom-header"}>
          <div className={"i-selector"}>
            <RenderSelection
              key={`instalation`}
              selectedOption={selectedOption}
              options={options}
              onSelection={(option: SelectOption) => {
                setSelectedOption(option);
                setSelectedIid(option.id);
              }}
            />
          </div>
          <div className={"i-label"}>
            {selectedIReport.tipo} {selectedIReport.nombre}
          </div>
          <div className={"i-dateRange"}>
            {dateRange.startDate} {dateRange.endDate}
          </div>
        </Card.Header>
        <Card.Body className={"c-body-all"}>
          <div className={"i-report"}>
            <ReactJson
              name="Reporte Instalación"
              displayObjectSize={false}
              collapsed={false}
              iconStyle="circle"
              displayDataTypes={false}
              indentWidth={2}
              quotesOnKeys={false}
              src={formatIReport()}
            />
          </div>
          <div className={"all-b"}>
            {selectedIReport.bahia_details
              .sort((b, a) => {
                return a.voltaje - b.voltaje;
              })
              .map((b, ix) => (
                <IndividualBahiaReport key={ix} bReport={b} />
              ))}
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};
