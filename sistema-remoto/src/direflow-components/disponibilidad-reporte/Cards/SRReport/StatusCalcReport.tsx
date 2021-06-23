import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Spinner, ProgressBar } from "react-bootstrap";
import ReactJson from "react-json-view";
import "./style.css";
import { StatusReport } from "./Report";
import { SRM_API_URL } from "../../../../Constantes";
import { to_yyyy_mm_dd_hh_mm_ss } from "../../../Common/DatePicker/DateRange";

type StatusCalcReportProps = {
  ini_date: Date;
  end_date: Date;
  onFinish: Function;
};

type StatusCalcReportState = {
  log: Object;
  status: Array<StatusReport>;
  percentage: number;
  isFetching: boolean;
  all_finished: boolean;
  isFinish: boolean;
};

class StatusCalcReport extends Component<
  StatusCalcReportProps,
  StatusCalcReportState
> {
  timer: any;
  abortController: AbortController;
  constructor(props) {
    super(props);
    this.state = {
      log: undefined,
      status: [],
      percentage: 0,
      isFetching: false,
      all_finished: false,
      isFinish: false,
    };
    this.abortController = new AbortController();
  }

  componentDidMount() {
    if (
      this.props.ini_date === undefined ||
      this.props.end_date === undefined
    ) {
      return;
    }
    // consultar el estado del cálculo
    this.timer = setInterval(() => this._inform_status(), 12000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
    this.timer = null;
    try {
      this.abortController.abort();
    } catch {}
  }

  _handle_finish_report_status = async () => {
    this.props.onFinish(this.state.log);
  };

  _inform_status = async () => {

    if (this.state.isFinish) { 
      setTimeout(() => {
        this._handle_finish_report_status();
      }, 10000);
    }

    this.setState({ isFetching: true });
    let path =
      SRM_API_URL + "/disp-sRemoto/estado/disponibilidad/" + this._range_time();
    await fetch(path, { signal: this.abortController.signal })
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          json.status.sort(function (a, b) {
            return a.percentage - b.percentage;
          });
          this.setState({ status: json.status });
        }
        this.setState({ isFetching: false, log: json }, () => { 
          this._processing_percentage();
          if (this.state.all_finished && !this.state.isFinish) {
            this.setState({ percentage: 100, isFinish: true});
            return;
          }
        }
        );
      })
      .catch(console.log);
  };

  _processing_percentage = () => {
    let p = 0;
    let all_finished = true;
    this.state.status.forEach((status_report) => {
      p += status_report.percentage;
      all_finished = all_finished && status_report.finish;
    });
    if (this.state.status.length > 0) {
      p = p / this.state.status.length;
    }
    this.setState({ percentage: p, all_finished: all_finished});
  };

  _range_time = () => {
    return (
      to_yyyy_mm_dd_hh_mm_ss(this.props.ini_date) +
      "/" +
      to_yyyy_mm_dd_hh_mm_ss(this.props.end_date)
    );
  };

  _render_processing_average() {
    return (
      <div className="pr-container">
        <Spinner
          className="pr-spinner"
          animation="border"
          role="status"
          size="sm"
        />
        <div className="pr-label"> Procesando:</div>
        <div className="pr-bar">
          <ProgressBar
            now={this.state.percentage}
            label={this.state.percentage.toFixed(2) + " %"}
          />
        </div>
      </div>
    );
  }

  _render_status = () => {
    return this.state.status.map((report) => (
      <div key={report.id_report} className="pr-status-node">
        <div className="pr-status-label">{report.info.nombre}</div>
        <div className="pr-status-bar">
          <ProgressBar
            now={report.percentage}
            label={report.percentage.toFixed(1) + " %"}
          />
        </div>
        <div className="pr-status-msg">{report.msg}</div>
      </div>
    ));
  };

  render() {
    window.onkeydown = function (e) {
      if (e.keyCode === 8)
        if (e.target === document.body) {
          e.preventDefault();
        }
    };
    return (
      <div className="pr-general-container">
        {this.state.log === undefined ? (
          <></>
        ) : (
          <ReactJson
            name="log"
            displayObjectSize={true}
            collapsed={true}
            iconStyle="circle"
            displayDataTypes={false}
            theme="monokai"
            src={this.state.log}
          />
        )}
        {this.state.isFetching
          ? this._render_processing_average()
          : this._render_processing_average()}
        <br></br>
        <br></br>
        {this.state.isFetching ? this._render_status() : this._render_status()}
      </div>
    );
  }
}

export default StatusCalcReport;
