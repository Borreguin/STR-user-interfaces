import { Button } from "react-bootstrap";
import { es } from "date-fns/locale";
import React, { useEffect } from "react";
import { DateRange } from "react-date-range";
import {
  get_last_month_dates,
  parseSpanishDate,
  toLocalString,
} from "../../Common/DatePicker/DateRange";

interface DatePickSelectorProps {
  onChange: Function;
}

export const DatePickSelector = (props: DatePickSelectorProps) => {
  const { onChange } = props;
  const [showDate, setShowDate] = React.useState(false);
  const [iniDateStr, setIniDateStr] = React.useState("");
  const [endDateStr, setEndDateStr] = React.useState("");
  const [iniDate, setIniDate] = React.useState(
    get_last_month_dates().first_day_month,
  );
  const [endDate, setEndDate] = React.useState(
    get_last_month_dates().last_day_month,
  );

  const [range, setRange] = React.useState({
    startDate: get_last_month_dates().first_day_month,
    endDate: get_last_month_dates().last_day_month,
    key: "selection",
  });

  useEffect(() => {
    setIniDateStr(toLocalString(iniDate));
    setEndDateStr(toLocalString(endDate));
  }, [iniDate, endDate]);

  useEffect(() => {
    onChange(range.startDate, range.endDate);
  }, [range]);

  // input changes
  const onChangeDate = (e, id) => {
    let dt = parseSpanishDate(e.target.value);
    const isIniDate = id === "ini_date";
    const isEndDate = id === "end_date";
    if (dt !== null) {
      if (isIniDate && dt.getTime() < endDate.getTime()) {
        setRange({ ...range, startDate: new Date(dt) });
      }
      if (isEndDate && dt.getTime() > iniDate.getTime()) {
        setRange({ ...range, endDate: new Date(dt) });
      }
      onChange(iniDate, endDate);
    }
    if (isIniDate) {
      setIniDateStr(e.target.value);
    }
    if (isEndDate) {
      setEndDateStr(e.target.value);
    }
  };

  const handleSelect = (range) => {
    setRange(range.selection);
    setIniDateStr(toLocalString(range.selection.startDate));
    setEndDateStr(toLocalString(range.selection.endDate));
  };

  return (
    <div className={"date-selector"}>
      <div
        className="date-container"
        onMouseLeave={(e) => {
          let class_name = e.target["className"];
          if (
            class_name === "" ||
            class_name === "rdrMonth" ||
            class_name === "rdrDays" ||
            class_name === "rdrYearPicker" ||
            class_name === "rdrDayHovered"
          ) {
            return;
          }
          setShowDate(false);
        }}
      >
        <Button
          variant="outline-dark"
          onClick={() => {
            setShowDate(!showDate);
          }}
          className="left-button"
        >
          {!showDate ? "Seleccionar" : "Aceptar"}
        </Button>
        <div className={"date-range"}>
          <input
            className={"date-input"}
            value={iniDateStr}
            onChange={(e) => onChangeDate(e, "ini_date")}
          />
          <input
            className="date-input"
            value={endDateStr}
            onChange={(e) => onChangeDate(e, "end_date")}
          />
        </div>
        <div className={showDate ? "date-range-show" : "date-range-no-show"}>
          <DateRange
            locale={es}
            ranges={[range]}
            showMonthAndYearPickers={true}
            dateDisplayFormat={"yyyy MMM d"}
            onChange={handleSelect}
            months={1}
            direction="horizontal"
            fixedHeight={true}
            column="true"
          />
        </div>
      </div>
    </div>
  );
};
