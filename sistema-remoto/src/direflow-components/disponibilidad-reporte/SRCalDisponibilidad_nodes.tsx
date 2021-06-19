import React, { Component } from "react";
import "../styles.css";
import { SummaryReport } from "../../../components/Reports/SRReport/Report";
import IndividualReport from "../../../components/Reports/SRReport/IndividualReport";
import StatusCalcReport from "../../../components/Reports/SRReport/StatusCalcReport";

type NodeReportProps = {
  reports: Array<SummaryReport>;
  ini_date: Date;
  end_date: Date;
  calculating: boolean;
  onChange: Function;
  onFinish: Function;
};

type NodeReportState = {
  finish: boolean
  log: object| undefined;
};

class NodeReport extends Component<NodeReportProps, NodeReportState> {
  constructor(props) { 
    super(props);
    this.state = { 
      finish: false, log: undefined
    }
  }
  _handle_finish_calculation = (log) => { 
    this.setState({ finish: true, log: log});
    this.props.onFinish(log);
  }
  
  render() {
    return (
      <div className="calc_report">
        {this.props.calculating && !this.state.finish ?
          <StatusCalcReport
            ini_date={this.props.ini_date}
            end_date={this.props.end_date}
            onFinish={this._handle_finish_calculation}
          />
          :
           <></> 
        }
        {this.props.reports === undefined || this.props.calculating ? (
          <></>
        ) : (
          this.props.reports.map((report) => (
            <IndividualReport
              key={report.id_report}
              report={report}
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
