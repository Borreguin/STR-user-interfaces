import React, { Component } from "react";
import moment from "moment";
import {
  AreaChart,
  XAxis,
  YAxis,
  Area,
  Tooltip,
  CartesianGrid,
  Legend,
  LineChart,
  Line,
  Brush,
  ResponsiveContainer,
} from "recharts";
import { simpleData } from "./util";
import styles from "./styles";

interface Props {
  data: Array<Object>;
}
interface States {}

export class RechartsAreaChart extends Component<Props, States> {
  constructor(props: Readonly<Props>) {
    super(props);
    this.state = {
      data: simpleData().map(({ x, y }) => ({
        date: x,
        "Disponibilidad Adquisición Datos": y,
      })),
    };
  }
  render() {
    const data = this.props.data;
    const max_v = 105;
    const min_v = 85;
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
              dataKey="Disponibilidad Adquisición Datos"
              domain={[min_v, max_v]}
              style={{ fontSize: 10 }}
            />
            <Tooltip wrapperStyle={{ fontSize: 12 }} />

            <Line
              stackId="1"
              isAnimationActive={false}
              type="stepAfter"
              dataKey="Disponibilidad Adquisición Datos"
              stroke="#0095FF"
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
