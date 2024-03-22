import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Card } from "react-bootstrap";
import "./style.css";
import { Report } from "./Report";
import { RowValue } from "./RowValue";
import { documentVersion } from "../../../Common/CommonConstants";

export interface GeneralReportProps {
  report: Report;
  calculating: boolean;
}

interface state {
  isVersion2: boolean;
}

class SRGeneralReport extends Component<GeneralReportProps, state> {
  constructor(props) {
    super(props);
    this.state = {
      isVersion2:
        this.props.report?.documento === documentVersion.finalReportV2,
    };
  }

  _format_date = () => {
    return this.props.report.actualizado.split(".")[0];
  };

  _format_percentage = (percentage) => {
    if (percentage < 0) {
      return "No definida";
    } else {
      return percentage.toFixed(6);
    }
  };

  _get_processed_tags_number = () => {
    return this.state.isVersion2
      ? this.props.report.procesamiento.numero_tags_procesadas
      : this.props.report.procesamiento.numero_tags_total;
  };

  _get_processed_utrs_or_instalaciones_number = () => {
    return this.state.isVersion2
      ? this.props.report.procesamiento.numero_instalaciones_procesadas
      : this.props.report.procesamiento.numero_utrs_procesadas;
  };

  _get_failed_utrs_or_instalaciones_number = () => {
    return this.state.isVersion2
      ? this.props.report.novedades.instalaciones_fallidas
      : this.props.report.novedades.utr_fallidas;
  };

  render() {
    return this.props.report.procesamiento === undefined ? (
      <></>
    ) : (
      <div className="gr-sc-container">
        <div className="gr-sc-result">
          <Card className="gr-sc-block" border="dark">
            <Card.Body className="gr-sc-padding">
              <Card.Title>Resultado</Card.Title>
              <div>
                <RowValue
                  label={"Disponibilidad Promedio:"}
                  value={
                    this._format_percentage(
                      this.props.report.disponibilidad_promedio_porcentage,
                    ) + "%"
                  }
                />
                <RowValue
                  label={"Disponibilidad Promedio Ponderada:"}
                  value={
                    this._format_percentage(
                      this.props.report
                        .disponibilidad_promedio_ponderada_porcentage,
                    ) + "%"
                  }
                />
                <br></br>
                <RowValue
                  label={"Fecha de cálculo:"}
                  value={this._format_date()}
                  valueClassName="gr-sc-date"
                />
                <br></br>
              </div>
              <div className="gr-sc-footer">
                Periodo de evaluación:{" "}
                {this.props.report.periodo_evaluacion_minutos} minutos
              </div>
            </Card.Body>
          </Card>
        </div>
        <div className="gr-sc-processing">
          <Card className="gr-sc-block" border="dark">
            <Card.Body className="gr-sc-padding">
              <Card.Title>Procesamiento</Card.Title>
              <div>
                <RowValue
                  label={"Tags calculadas:"}
                  value={"" + this._get_processed_tags_number()}
                />
                {this.state.isVersion2 ? (
                  <RowValue
                    label={"Bahias calculadas:"}
                    value={
                      "" +
                      this.props.report.procesamiento.numero_bahias_procesadas
                    }
                  />
                ) : (
                  <></>
                )}

                <RowValue
                  label={
                    this.state.isVersion2
                      ? "Instalaciones calculadas"
                      : "UTRs calculadas:"
                  }
                  value={
                    "" + this._get_processed_utrs_or_instalaciones_number()
                  }
                />
                <RowValue
                  label={"Entidades calculadas:"}
                  value={
                    "" +
                    this.props.report.procesamiento.numero_entidades_procesadas
                  }
                />
                <RowValue
                  label={"Nodos calculados:"}
                  value={
                    "" + this.props.report.procesamiento.numero_nodos_procesados
                  }
                />
                {this.props.report.numero_consignaciones !== null &&
                  this.props.report.numero_consignaciones > 0 && (
                    <RowValue
                      label={"Consignaciones:"}
                      value={"" + this.props.report.numero_consignaciones}
                    />
                  )}
              </div>
              <br></br>
              <div className="gr-sc-footer">
                Tiempo de procesamiento:{" "}
                {Math.floor(this.props.report.tiempo_calculo_segundos / 60)} min{" "}
                {Math.floor(this.props.report.tiempo_calculo_segundos % 60)}{" "}
                seg.{" "}
              </div>
            </Card.Body>
          </Card>
        </div>
        <div className="gr-sc-novedades">
          <Card className="gr-sc-block" border="dark">
            <Card.Body className="gr-sc-padding">
              <Card.Title>Novedades</Card.Title>
              <div>
                <RowValue
                  label={"Tags falladas:"}
                  value={"" + this.props.report.novedades.tags_fallidas}
                />
                {this.state.isVersion2 ? (
                  <RowValue
                    label={"Bahias falladas:"}
                    value={"" + this.props.report.novedades.bahias_fallidas}
                  />
                ) : (
                  <></>
                )}
                <RowValue
                  label={
                    this.state.isVersion2
                      ? "Instalaciones falladas"
                      : "UTRs falladas:"
                  }
                  value={"" + this._get_failed_utrs_or_instalaciones_number()}
                />
                <RowValue
                  label={"Entidades falladas:"}
                  value={"" + this.props.report.novedades.entidades_fallidas}
                />
                <RowValue
                  label={"Nodos fallados:"}
                  value={"" + this.props.report.novedades.nodos_fallidos}
                />
              </div>
              <br></br>
              <div className="gr-sc-footer">
                Click "novedades" para más información
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    );
  }
}

export default SRGeneralReport;
