import { Styled } from "direflow-component";
import React, { Component } from "react";
import { Button, Col, Row, Spinner } from "react-bootstrap";
import style from "./App.css";
import react_picker from "react-datepicker/dist/react-datepicker.css";
import { DateRange } from "../Common/DatePicker/DateRange";
import { SRM_API_URL } from "../../Constantes";
import { range_to_yyyy_mm_dd } from "../Common/DatePicker/DateRangeTimeOne";
import { RechartsAreaChart } from "./RechartsAreaChart";
import { ConsignacionesTable } from "./ConsignacionesTable";
import { service_daily_dispo_trend, service_monthly_control_disp_trend } from "./services";
import { daily_value, monthly_value } from "./types";

interface Props {
  componentTitle: string;
  sampleList: string[];
}

interface States {
  loading: boolean;
  active: boolean;
  log: string;
  success: boolean;
  ini_date: Date;
  end_date: Date;
  daily_trend: Array<daily_value>;
  montly_trend: Array<monthly_value>;
}

class TendenciaDisponibilidadAdquisicion extends Component<Props, States> {
  /* Configuración de la página: */
  constructor(props: Readonly<Props>) {
    super(props);

    this.state = {
      loading: true,
      active: false,
      log: "",
      success: false,
      ini_date: new Date(new Date().setDate(new Date().getDate() - 200)),
      end_date: new Date(),
      daily_trend: [],
      montly_trend: []
    };
  }

  componentDidMount = () => {
    this.get_trend_values();
  };

  get_trend_values = () => {
    this.setState({loading:true});
    // Valores diarios de disponibilidad de la información del SCADA
    var p1 = service_daily_dispo_trend(this.state.ini_date, this.state.end_date);
    // Valores mensuales de la disponibilidad del Centro de Control
    var p2 = service_monthly_control_disp_trend(this.state.ini_date, this.state.end_date);
    // Ejecutar los servicios:
    Promise.all([p1, p2]).then((resp) => {
      this.setState({daily_trend: resp[0].values, montly_trend: resp[1].values, loading:false});
    })
  };

  _on_picker_change = (ini_date, end_date) => {
    this.setState({ ini_date: ini_date, end_date: end_date });
  };

  render() {
    window.onkeydown = function (e) {
      if (e.keyCode === 8)
        if (e.target === document.body) {
          e.preventDefault();
        }
    };
    let path = `${SRM_API_URL}/sRemoto/tendencia/diaria/json/${range_to_yyyy_mm_dd(this.state.ini_date, this.state.end_date)}`;

    return (
      <Styled styles={[style, react_picker]} scoped={true}>
        <div>
          <>
            <Row>
              <Col className="btn-aplicar">
                <Button
                  className="btn-app"
                  variant="outline-secondary"
                  onClick={this.get_trend_values}
                >
                  Aplicar
                </Button>
              </Col>
              <Col>
                <DateRange
                  last_month={true}
                  onPickerChange={this._on_picker_change}
                ></DateRange>
              </Col>
              <Col>
                <a
                  style={{ float: "right", marginRight: "45px" }}
                  target={"_blank"}
                  rel="noopener noreferrer"
                  href={path}
                >
                  JSON info
                </a>
              </Col>
            </Row>
          </>

          {this.state.loading ? (
            <div>
              <Spinner animation="border" /> <span>Cargando valores...</span>
            </div>
          ) : (
            <>
                <RechartsAreaChart daily_trend={this.state.daily_trend} monthly_trend={ this.state.montly_trend} />
            </>
          )}
          <ConsignacionesTable
            ini_date={this.state.ini_date}
            end_date={this.state.end_date}
          />
        </div>
      </Styled>
    );
  }
}

export default TendenciaDisponibilidadAdquisicion;
