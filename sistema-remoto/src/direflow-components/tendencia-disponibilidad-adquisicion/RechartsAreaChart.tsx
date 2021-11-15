import React, { Component } from "react";
import moment from "moment";
import {
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  LineChart,
  Line,
  Brush,
  ResponsiveContainer,
} from "recharts";
import styles from "./styles";
import { daily_value, monthly_value } from "./types";

interface Props {
  daily_trend: Array<daily_value>;
  monthly_trend: Array<monthly_value>;
}
interface States {}

export class RechartsAreaChart extends Component<Props, States> {
  constructor(props: Readonly<Props>) {
    super(props);
  }
  render() {
    var data = [];
    const daily_trend = this.props.daily_trend;
    const monthly_trend = this.props.monthly_trend;
    const max_v = 105;
    const min_v = 85;
    if (daily_trend.length > 0) {
      let value = null;
      for (var daily of daily_trend) {
        for (var monthly of monthly_trend) {
          if (monthly.date === daily.date) {
            value = monthly["Disp. mensual centro control"];
            break;
          }
        }
        let reg = {
          "date": daily.date,
          "Disp. diaria adquisición Datos": daily["Disp. diaria adquisición Datos"],
          "Disp. mensual centro control": value
        }
        data.push(reg);
      }
    } else {
      data = monthly_trend;
    }
    console.log("data:", data);
    return (
      <div style={styles.container}>
        <ResponsiveContainer width="95%" height={400}>
          <LineChart
            data={data}
            margin={{ top: 50, right: 20, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <Legend wrapperStyle={{ margin: 4, fontSize: 12 }} />
            <XAxis
              dataKey="date"
              tickFormatter={(tick) => {
                const label = moment(tick).format("D-MMM");
                return label;
              }}
              style={{ fontSize: 10 }}
            />
            <YAxis
              dataKey="Disp. diaria adquisición Datos"
              domain={[min_v, max_v]}
              style={{ fontSize: 10 }}
            />
            <Tooltip wrapperStyle={{ fontSize: 12 }} />

            <Line
              stackId="1"
              isAnimationActive={false}
              type="stepAfter"
              dataKey="Disp. diaria adquisición Datos"
              stroke="#0095FF"
            />

            <Line
              stackId="2"
              isAnimationActive={false}
              type="stepAfter"
              dataKey="Disp. mensual centro control"
              stroke="#A095FA"
            />

            <Brush
              dataKey="date"
              style={{ fontSize: 10 }}
              height={30}
              tickFormatter={(tick) => {
                const label = moment(tick).format("yyyy-M-D");
                return label;
              }}
              y={0}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }
}
