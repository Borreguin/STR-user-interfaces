import { Styled } from "direflow-component";
import React, { Component } from "react";
import { Button, Col, Row, Spinner } from "react-bootstrap";
import style from "./App.css";
import react_picker from "react-datepicker/dist/react-datepicker.css";
import { DateRange } from "../Common/DatePicker/DateRange";
import { SRM_API_URL } from "../../Constantes";
import { to_yyyy_mm_dd } from "../Common/DatePicker/DateRangeTimeOne";
import { RechartsAreaChart } from "./RechartsAreaChart";
import { ConsignacionesTable } from "./ConsignacionesTable";

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
  values: Array<Number>;
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
      values: [],
    };
  }

  componentDidMount = () => {
    this.get_trend_values();
  };

  get_trend_values = () => {
    let path = `${SRM_API_URL}/sRemoto/tendencia/diaria/json/${to_yyyy_mm_dd(
      this.state.ini_date
    )}/${to_yyyy_mm_dd(this.state.end_date)}`;
    this.setState({ loading: true });
    fetch(path)
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          var result = [];
          for (const idx in json.result.dates) {
            result.push({
              date: json.result.dates[idx],
              "Disponibilidad Adquisición Datos":
                json.result.values[idx] === null
                  ? json.result.values[idx]
                  : json.result.values[idx].toFixed(3),
            });
          }
          this.setState({ values: result, loading: false });
        }
      })
      .catch((e) => {
        this.setState({
          loading: true,
          log: "Problema de conexión con la API-RMT",
        });
        console.log(e);
      });
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
    let path = `${SRM_API_URL}/sRemoto/tendencia/diaria/json/${to_yyyy_mm_dd(
      this.state.ini_date
    )}/${to_yyyy_mm_dd(this.state.end_date)}`;

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
              <Col >
                <DateRange
                  last_month={true}
                  onPickerChange={this._on_picker_change}
                ></DateRange>
              </Col>
              <Col>
                <a style={ {float:"right", marginRight:"45px"}} target={"_blank"} href={path}>
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
              
              <RechartsAreaChart data={this.state.values} />
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
