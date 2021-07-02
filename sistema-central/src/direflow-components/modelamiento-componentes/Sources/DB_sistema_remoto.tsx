import { DateRange } from "react-date-range";
import { es } from "date-fns/locale";
import React, { Component, useState } from "react";
import { Button, Form } from "react-bootstrap";

import "./Sources.css";
import ReactJson from "react-json-view";
import { get_last_month_dates, to_yyyy_mm_dd_hh_mm_ss } from "../common_functions";

export interface props {
  handle_msg?: Function;
}

export type Range = {
  startDate: Date;
  endDate: Date;
  key: string;
};

export interface state {
  show_date: boolean;
  ini_date: Date;
  ini_date_str: string;
  end_date: Date;
  end_date_str: string;
  range: Array<Range>;
  log: Object;
}

export class DB_sistema_remoto extends Component<props, state> {
  constructor(props) {
    super(props);
    let r = get_last_month_dates();
    let range = {
      startDate: r.first_day_month,
      endDate: r.last_day_month,
      key: "selection",
    };
    this.state = {
      show_date: false,
      ini_date: r.first_day_month,
      ini_date_str: to_yyyy_mm_dd_hh_mm_ss(r.first_day_month),
      end_date: r.last_day_month,
      end_date_str: to_yyyy_mm_dd_hh_mm_ss(r.last_day_month),
      range: [range],
      log: {msg: "Aún no se ha ejecutado la prueba"}
    };
  }

  _handle_message = (msg) => {
    if (this.props.handle_msg !== undefined) {
      this.props.handle_msg(msg);
    }
  };

  componentDidMount = () => {};

  /*_handle_selection = (e) => {
    this.setState({ select: e.target.value });
  };*/

  handleSelect = (range) => {
    this.setState({
      range: [range.selection],
      ini_date: range.selection.startDate,
      ini_date_str: to_yyyy_mm_dd_hh_mm_ss(range.selection.startDate),
      end_date: range.selection.endDate,
      end_date_str: to_yyyy_mm_dd_hh_mm_ss(range.selection.endDate),
    });
  };

  onChangeDate = (e, id) => {
    let dt = Date.parse(e.target.value);
    let isIniDate = id === "ini_date";
    let isEndDate = id === "end_date";
    if (!isNaN(dt)) {
      if (isIniDate) {
        this.setState({ ini_date: new Date(dt) });
      }
      if (isEndDate) {
        this.setState({ end_date: new Date(dt) });
      }
    }
    if (isIniDate) {
      this.setState({ ini_date_str: e.target.value });
    }
    if (isEndDate) {
      this.setState({ end_date_str: e.target.value });
    }
  };

  handle_picker_change = (ini_date, end_date) => {
    console.log(ini_date, end_date);
    // this.setState({ ini_date: ini_date, end_date: end_date });
  };

  render() {
    return (
      <>
        <Form.Group>
          <Form.Label>
            Nombre de la colección:
          </Form.Label>
          <Form.Control as="select">
            <option>Collección 1</option>
            <option>Collección 2</option>
          </Form.Control>
          <br></br>

          <Form.Label>
            <div className="date-container">
              <Button
                variant="outline-dark"
                className="btn-date-fixed"
                onClick={() => {
                  this.setState({ show_date: !this.state.show_date });
                }}
              >
                {!this.state.show_date ? "Seleccionar" : "Aceptar"}
              </Button>
              <input
                className="date-input"
                value={this.state.ini_date_str}
                onChange={(e) => this.onChangeDate(e, "ini_date")}
              />{" "}
              <input
                className="date-input"
                value={this.state.end_date_str}
                onChange={(e) => this.onChangeDate(e, "end_date")}
              />
              <div
                className={
                  this.state.show_date
                    ? "date-range-show"
                    : "date-range-no-show"
                }
              >
                <DateRange
                  locale={es}
                  ranges={this.state.range}
                  showMonthAndYearPickers={true}
                  dateDisplayFormat={"yyyy MMM d"}
                  onChange={this.handleSelect}
                  months={1}
                  direction="horizontal"
                  fixedHeight={true}
                  column="true"
                />
              </div>
            </div>
          </Form.Label>

          <Button variant="outline-info" className="test-manual-btn">
            Probar
          </Button>
        </Form.Group>
        <Form.Group>
        <ReactJson
            name="log"
            displayObjectSize={true}
            collapsed={true}
            iconStyle="circle"
            displayDataTypes={false}
            theme="monokai"
            src={this.state.log}
          />
        </Form.Group>
      </>
    );
  }
}
