import React, { Component } from "react";
import moment from "moment";
import {
  AreaChart,
  XAxis,
  YAxis,
  Area,
  Tooltip,
  CartesianGrid,
  Legend
} from "recharts";
import { simpleData } from "./util";
import styles from "./styles";

export class RechartsAreaChart extends Component {
  constructor() {
    super();
    this.state = {
      data: simpleData().map(({ x, y }) => ({ x,  y}))
    };
  }
  render() {
    const { data } = this.state;
    console.log(data);
    return (
      <div style={styles.container}>
        <h3 style={styles.title}>Recharts Stacked Area Chart</h3>
        <AreaChart
          width={styles.width}
          height={styles.height}
          data={data}
          margin={{ top: 32, right: 32, left: -16, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <Legend wrapperStyle={{ margin: 4, fontSize: 12 }} />
          <XAxis
            dataKey="x"
            tickFormatter={tick => {
              const label = moment(tick).format("hh:mm:ss");
              return label;
            }}
            style={{ fontSize: 10 }}
          />
          <YAxis
            dataKey="y"
            domain={[0, 2 * Math.max(...data.map(d => d.y))]}
            style={{ fontSize: 10 }}
          />
          <Tooltip wrapperStyle={{ fontSize: 8 }} />

          <Area
            stackId="1"
            isAnimationActive={false}
            type="monotone"
            dataKey="y"
            stroke="rgb(110, 161, 207)"
            fill="rgb(110, 161, 207)"
          />
        </AreaChart>
      </div>
    );
  }
}