import { Styled } from "direflow-component";
import React, { Component } from "react";
import { Alert, Button, Col, Spinner, Tab, Tabs } from "react-bootstrap";
import style from "./App.css";
import react_picker from "react-datepicker/dist/react-datepicker.css";
import { to_yyyy_mm_dd_hh_mm_ss } from "../Common/DatePicker/DateRange";
import { SRM_API_URL } from "../../Constantes";
import { to_yyyy_mm_dd } from "../Common/DatePicker/DateRangeTimeOne";
import { RechartsAreaChart } from "./RechartsAreaChart";

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
      ini_date: new Date(),
      end_date: new Date(new Date().setDate(new Date().getDate() - 15)),
      values: [],
    };
  }

  componentDidMount = () => {
    let path = `${SRM_API_URL}/sRemoto/tendencia/diaria/json/${to_yyyy_mm_dd(
      this.state.ini_date
    )}/${to_yyyy_mm_dd(this.state.end_date)}`;
    fetch(path)
      .then((res) => res.json())
      .then((json) => {
        console.log(json);
      })
      .catch((e) => {
        this.setState({
          loading: true,
          log: "Problema de conexión con la API-RMT",
        });
        console.log(e);
      });
  };

  render() {
    window.onkeydown = function (e) {
      if (e.keyCode === 8)
        if (e.target === document.body) {
          e.preventDefault();
        }
    };
    //

    return (
      <Styled styles={[style, react_picker]} scoped={true}>
        <div>
          {false ? (
            <div>
              {" "}
              <Spinner animation="border" /> <span>Cargando valores...</span>
            </div>
          ) : (
            <RechartsAreaChart />
          )}
        </div>
      </Styled>
    );
  }
}

export default TendenciaDisponibilidadAdquisicion;
