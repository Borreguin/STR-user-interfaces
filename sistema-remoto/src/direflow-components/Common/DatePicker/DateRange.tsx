import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./style.css";

export interface RangeDateProps {
  last_month?: boolean,
  onPickerChange: Function,
}

export type RangeDateState = {
  ini_date: Date,
  end_date: Date
}

export const to_yyyy_mm_dd = (date) => { 
  return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
}

export const to_dd_mm_yyyy = (date) => { 
  return date.getDate() +  "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
}


export const to_yyyy_mm_dd_hh_mm_ss = (date:Date) => { 
  return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " +
    date.getHours() + ":" + date.getMinutes() + ":"  + date.getSeconds();
}

export const get_last_month_dates = () => { 
  let now = new Date();
  let first_day_month = new Date(
    now.getFullYear(),
    now.getMonth() - 1,
    1
  );
  let last_day_month = new Date(
    now.getFullYear(),
    now.getMonth(),
    0
  );
  return {first_day_month:first_day_month, last_day_month:last_day_month}

}

export class DateRange extends React.Component<RangeDateProps, RangeDateState>{
  
  constructor(props) { 
    super(props);
    this.state = {
      ini_date: new Date(),
      end_date: new Date()
    }
    if (this.props.last_month) {
      let r = get_last_month_dates()
      this.state = {
        ini_date: r.first_day_month,
        end_date: r.last_day_month
      }
    } 
    this.handle_picker_change();
  }
  

  // funcion que llama a funcion de parametro onChange
  // ligada al padre
  handle_picker_change = () => {
    this.props.onPickerChange(this.state.ini_date, this.state.end_date);
  };

  setStartDate = (date) => { 
    this.setState({ini_date:date})
  }

  setEndDate = (date) => { 
    this.setState({end_date:date})
  }

  render() { 
    return (
      <div className="div-pick-container">
        <div>
          <div className="div_middle">
            <DatePicker
              className="picker-div"
              selected={this.state.ini_date}
              onChange={(date) => this.setStartDate(date)}
              onBlur={this.handle_picker_change}
              selectsStart
              startDate={this.state.ini_date}
              endDate={this.state.end_date}
            />
          </div>
        </div>
        <div>
          <DatePicker
            className="picker-div"
            selected={this.state.end_date}
            onChange={(date) => this.setEndDate(date)}
            selectsEnd
            onBlur={this.handle_picker_change}
            startDate={this.state.ini_date}
            endDate={this.state.end_date}
            minDate={this.state.ini_date}
          />
        </div>
      </div>
    );
  }
};
