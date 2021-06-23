import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Card } from "react-bootstrap";
import "./style.css";
import { Report } from "./Report";

export interface GeneralReportProps {
  report: Report;
  calculating: boolean;
}

class SRGeneralReport extends Component<GeneralReportProps> {

  constructor(props) { 
    super(props)
    let tiempo_calculo_segundos = 0;
    this.props.report.reportes_nodos.forEach((report) => { 
      tiempo_calculo_segundos = Math.max(tiempo_calculo_segundos, report.tiempo_calculo_segundos);
    })
  }

  _format_date = () => { 
    return this.props.report.actualizado.split(".")[0];
  }

  _format_percentage = (percentage) => { 
    if (percentage < 0) {
      return "No definida";
    } else { 
      return percentage.toFixed(6);
    }
  }

  render() {
    return (
       this.props.report.procesamiento === undefined? <></>:
      <div className="gr-sc-container">
        <div className="gr-sc-result">
          <Card className="gr-sc-block" border="dark" >
            <Card.Body className="gr-sc-padding">
            <Card.Title>Resultado</Card.Title>
              <div className="gr-sc-subtitle">Disponibilidad Promedio:</div>
              <div className="gr-sc-value">{this._format_percentage(this.props.report.disponibilidad_promedio_porcentage)}%</div>
              <div className="gr-sc-subtitle">Disponibilidad Promedio Ponderada:</div>
                <div className="gr-sc-value">{this._format_percentage(this.props.report.disponibilidad_promedio_ponderada_porcentage)}%</div>
                <br></br>
                <div className="gr-sc-subtitle">Fecha de cálculo</div>
                <div className="gr-sc-date">{this._format_date()}</div>
              <div className="gr-sc-footer">Periodo de evaluación: {this.props.report.periodo_evaluacion_minutos} minutos</div>
            </Card.Body>
          </Card>
        </div>
        <div className="gr-sc-processing">
          <Card className="gr-sc-block" border="dark" >
            <Card.Body className="gr-sc-padding">
              <Card.Title>Procesamiento</Card.Title>
              <div className="gr-sc-process-description">Tags calculadas:</div>
              <div className="gr-sc-process-value">{this.props.report.procesamiento.numero_tags_total}</div>
              <div className="gr-sc-process-description">UTRs calculadas:</div>
              <div className="gr-sc-process-value">{this.props.report.procesamiento.numero_utrs_procesadas}</div>
              <div className="gr-sc-process-description">Entidades calculadas:</div>
              <div className="gr-sc-process-value">{this.props.report.procesamiento.numero_entidades_procesadas}</div>
              <div className="gr-sc-process-description">Nodos calculados:</div>
              <div className="gr-sc-process-value">{this.props.report.procesamiento.numero_nodos_procesados}</div>
              <div className="gr-sc-footer">Tiempo de procesamiento: {Math.floor(this.props.report.tiempo_calculo_segundos/60)} min {Math.floor(this.props.report.tiempo_calculo_segundos % 60)} seg. </div>
            </Card.Body>
          </Card>
        </div>
        <div className="gr-sc-novedades">
          <Card className="gr-sc-block" border="dark" >
            <Card.Body className="gr-sc-padding">
            <Card.Title>Novedades</Card.Title>
            <div className="gr-sc-process-description">Tags falladas:</div>
              <div className="gr-sc-process-value">{this.props.report.novedades.tags_fallidas}</div>
              <div className="gr-sc-process-description">UTRs falladas:</div>
              <div className="gr-sc-process-value">{this.props.report.novedades.utr_fallidas}</div>
              <div className="gr-sc-process-description">Entidades falladas:</div>
              <div className="gr-sc-process-value">{this.props.report.novedades.entidades_fallidas}</div>
              <div className="gr-sc-process-description">Nodos fallados:</div>
              <div className="gr-sc-process-value">{this.props.report.novedades.nodos_fallidos}</div>
              <div className="gr-sc-footer">Click "novedades" para más información</div>
            </Card.Body>
          </Card>
        </div>
      </div>
    );
  }
}

export default SRGeneralReport;
