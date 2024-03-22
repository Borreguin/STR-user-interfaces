import React, { useEffect } from "react";
import {
  EntityReport,
  InstallationReport,
} from "../../disponibilidad-reporte/Cards/SRReport/Report";
import { Button, Card } from "react-bootstrap";
import { SelectOption } from "../../Common/FilterNodesV2/model";
import { RenderSelection } from "../../Common/FilterNodesV2/TypeNameSelector";
import ReactJson from "react-json-view";
import { DateRange } from "../../Common/V2GeneralTypes";
import { IndividualBahiaReport } from "./IndividualBahiaReport";
import { formatPercentage } from "../../Common/common-util";
import {
  lb_bahias_procesadas,
  lb_consignaciones_bahias,
  lb_consignaciones_instalacion,
  lb_disp_promedio,
  lb_indisp_promedio_minutos,
  lb_periodo_consignado_nivel_instalacion_minutos,
  lb_periodo_efectivo_minutos,
  lb_periodo_evaluacion_minutos,
  lb_ponderacion,
  lb_tags_procesadas,
} from "../../Common/common-constants";
import { ConsignmentModal } from "./ConsignmentModal";

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
  const [showConsignments, setShowConsignments] =
    React.useState<boolean>(false);

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
      [lb_disp_promedio]: formatPercentage(
        selectedIReport.disponibilidad_promedio_porcentage,
        3,
      ),
      [lb_ponderacion]: formatPercentage(selectedIReport.ponderacion, 3),
      [lb_bahias_procesadas]: selectedIReport.numero_bahias_procesadas,
      [lb_tags_procesadas]: selectedIReport.numero_tags_procesadas,
      [lb_consignaciones_instalacion]: selectedIReport.consignaciones.length,
      [lb_consignaciones_bahias]:
        selectedIReport.numero_consignaciones_internas,
      [lb_indisp_promedio_minutos]:
        selectedIReport.indisponibilidad_promedio_minutos,
      [lb_periodo_evaluacion_minutos]:
        selectedIReport.periodo_evaluacion_minutos,
      [lb_periodo_efectivo_minutos]: selectedIReport.periodo_efectivo_minutos,
      [lb_periodo_consignado_nivel_instalacion_minutos]:
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
              key={`installation`}
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
          <div>
            {(selectedIReport.consignaciones.length > 0 ||
              selectedIReport.numero_consignaciones_internas > 0) && (
              <Button onClick={() => setShowConsignments(true)}>
                Consignaciones
              </Button>
            )}
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
      {(selectedIReport.consignaciones.length > 0 ||
        selectedIReport.consignaciones_internas.length > 0) && (
        <ConsignmentModal
          title={`Consignaciones de ${selectedIReport.tipo} ${selectedIReport.nombre}`}
          consignments={selectedIReport.consignaciones_internas.concat(
            selectedIReport.consignaciones,
          )}
          show={showConsignments}
          onClose={() => setShowConsignments(false)}
        />
      )}
    </div>
  );
};
