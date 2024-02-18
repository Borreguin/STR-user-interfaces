import React, { Component } from "react";
import { SummaryReport } from "./Cards/SRReport/Report";
import IndividualReport from "./Cards/SRReport/IndividualReport";
import StatusCalcReport from "./Cards/SRReport/StatusCalcReport";

type NodeReportProps = {
  generalReportId: string;
  document: string;
  reports: Array<SummaryReport>;
  ini_date: Date;
  end_date: Date;
  calculating: boolean;
  onChange: Function;
  onFinish: Function;
};

type NodeReportState = {
  finish: boolean;
  log: object | undefined;
};

class NodeReport extends Component<NodeReportProps, NodeReportState> {
  constructor(props) {
    super(props);
    this.state = {
      finish: false,
      log: undefined,
    };
  }
  _handle_finish_calculation = (log: Object, successFinish: boolean) => {
    this.setState({ finish: true, log: log, calculating: false });
    this.props.onFinish(log, successFinish);
  };

  render() {
    return (
      <div className="calc_report">
        {this.props.calculating && !this.state.finish ? (
          <StatusCalcReport
            generalReportId={this.props.generalReportId}
            ini_date={this.props.ini_date}
            end_date={this.props.end_date}
            onFinish={this._handle_finish_calculation}
          />
        ) : (
          <></>
        )}
        {this.props.reports === undefined || this.props.calculating ? (
          <></>
        ) : (
          this.props.reports.map((report) => (
            <IndividualReport
              key={report.id_report}
              report={report}
              document={this.props.document}
              calculating={this.props.calculating}
              ini_date={this.props.ini_date}
              end_date={this.props.end_date}
              onChange={this.props.onChange}
            />
          ))
        )}
      </div>
    );
  }
}
export default NodeReport;
