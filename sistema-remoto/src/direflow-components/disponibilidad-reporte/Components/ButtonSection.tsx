import { Button, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileExcel,
  faPencilAlt,
  faPenFancy,
  faTag,
} from "@fortawesome/free-solid-svg-icons";
import { SRM_API_URL } from "../../../Constantes";
import ReactTooltip from "react-tooltip";
import React from "react";

interface ButtonSectionProps {
  loading: boolean;
  calculateAll: Function;
  downloadExcelReport: Function;
  downloadTagReport: Function;
  updateUmbral: Function;
  rangeTime: string;
}

export const ButtonSection = (props: ButtonSectionProps) => {
  const {
    loading,
    calculateAll,
    downloadExcelReport,
    downloadTagReport,
    updateUmbral,
    rangeTime,
  } = props;
  return (
    <Form.Group className="sc-btn-cal">
      <Button
        variant="outline-light"
        className={loading ? "btn-cal-disp btn-dis" : "btn-cal-disp"}
        onClick={() => calculateAll("POST")}
      >
        <FontAwesomeIcon inverse icon={faPencilAlt} size="lg" /> CALCULAR TODOS
      </Button>
      <Button
        variant="outline-light"
        className={loading ? "btn-cal-disp btn-dis" : "btn-cal-disp"}
        onClick={() => calculateAll("PUT")}
      >
        <FontAwesomeIcon inverse icon={faPenFancy} size="lg" /> RE-ESCRIBIR
        CÁLCULO
      </Button>

      <Button
        variant="outline-light"
        onClick={() => downloadExcelReport()}
        className={loading ? "btn-cal-disp btn-dis" : "btn-cal-disp"}
        data-tip={SRM_API_URL + "/sRemoto/disponibilidad/json/" + rangeTime}
      >
        <FontAwesomeIcon inverse icon={faFileExcel} size="lg" /> DESCARGAR
      </Button>
      <ReactTooltip />

      <div className={loading ? "btn-cal-disp btn-dis" : "btn-cal-disp"}>
        <Button
          className={
            loading ? "btn-download-report btn-dis" : "btn-download-report"
          }
          variant="outline-light"
          onClick={() => downloadTagReport()}
        >
          <FontAwesomeIcon inverse icon={faTag} size="lg" /> REPORTE TAGS
        </Button>
        <input
          type="text"
          onChange={(e) => updateUmbral(e.target.value)}
          className="input-report"
          data-tip="Ingrese el umbral de indisponibilidad mínima a reportar"
        ></input>
      </div>
      <ReactTooltip />
    </Form.Group>
  );
};
