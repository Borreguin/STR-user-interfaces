import React, { FC, useEffect } from "react";
import styles from "./style.css";
import bootstrap from "bootstrap/dist/css/bootstrap.min.css";
import { Styled } from "direflow-component";
import {
  NodeReport,
  EntityReport,
  InstallationReport,
} from "../disponibilidad-reporte/Cards/SRReport/Report";
import { getDetailedNodeReportById } from "../Common/FetchData/V2SRFetchData";
import { SpinnerAndText } from "./components/Spinner";
import { BahiaContainerReport } from "./components/BahiaContainerReport";
import { DateRange } from "../Common/V2GeneralTypes";

interface ConverterV2Props {}

const BahiaReport: FC<ConverterV2Props> = () => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [msg, setMsg] = React.useState<string>(undefined);
  const [nodeReport, setNodeReport] = React.useState<NodeReport>(null);
  const [eid, setEid] = React.useState<string>(undefined);
  const [iid, setIid] = React.useState<string>(undefined);
  const [entityReport, setEntityReport] = React.useState<EntityReport>(null);
  const [installationReport, setInstallationReport] =
    React.useState<InstallationReport>(null);
  const [found, setFound] = React.useState<boolean>(false);
  const [dateRange, setDateRange] = React.useState<DateRange>(undefined);

  useEffect(() => {
    async function fetchReportById(report_id: string) {
      if (report_id === null || report_id === "") {
        setMsg("Identicación de reporte no válida");
        return;
      }
      setLoading(true);
      const resp = await getDetailedNodeReportById(report_id);

      if (resp.success) {
        setNodeReport(resp.report);
        setDateRange({
          startDate: resp.report.fecha_inicio,
          endDate: resp.report.fecha_final,
        });
      } else {
        setMsg(resp.msg);
      }
    }
    const search = window.location.search;
    const params = new URLSearchParams(search);
    let _nid = params.get("nid");
    let _eid = params.get("eid");
    let _iid = params.get("iid");
    fetchReportById(_nid).then(() => {
      setLoading(false);
      setEid(_eid);
      setIid(_iid);
    });
  }, []);

  useEffect(() => {
    checkEntity();
  }, [nodeReport, iid]);

  const checkEntity = () => {
    if (nodeReport === null || eid === undefined) return;
    const entityreport = nodeReport.reportes_entidades.find((e) => {
      return e.document_id === eid;
    });
    if (entityreport === undefined) {
      setMsg(
        "No se encontró la entidad, es posible que el reporte haya sido recalculado o eliminado. Regrese al nuevo reporte",
      );
      return null;
    }
    setEntityReport(entityreport);
    const iReport = entityreport.reportes_instalaciones.find((i) => {
      return i.document_id === iid;
    });
    if (iReport === undefined) {
      setMsg("No se encontró la instalación");
      setFound(false);
      return null;
    }

    setMsg(undefined);
    setFound(true);
    setInstallationReport(iReport);
  };
  return (
    <Styled styles={[styles, bootstrap]} scoped={true}>
      <div className={"bahia-report-container"}>
        {loading && (
          <SpinnerAndText msg={"Cargando reporte..., espere por favor"} />
        )}
        {msg !== undefined ? (
          <div style={{ maxWidth: "60%" }}>{msg}</div>
        ) : (
          <></>
        )}
        {found && (
          <BahiaContainerReport
            dateRange={dateRange}
            eReport={entityReport}
            iReport={installationReport}
            document_report_id={iid}
          />
        )}
      </div>
    </Styled>
  );
};

export default BahiaReport;
