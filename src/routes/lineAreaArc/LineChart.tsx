import * as d3 from "d3";
import ChartContainer from "../../components/ChartContainer";
import { Data, LineChartProps } from "./types";
import { css } from "@emotion/react";

import locale from "d3-time-format/locale/zh-CN";

d3.timeFormatDefaultLocale(locale as d3.TimeLocaleDefinition);

function LineChart({ data }: LineChartProps) {
  const width = 650;
  const height = 300;
  const margin = {
    top: 40,
    left: 40,
    right: 40,
    bottom: 40,
  };

  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const maxTems = d3.map(data, (d) => d.max_temp_F);

  const firstDate = new Date(2021, 0, 1, 0, 0, 0);
  const lastDate = d3.max(data, (d) => d.date);

  const xScale = d3
    .scaleTime()
    .domain([firstDate, lastDate])
    .range([0, innerWidth]);
  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(maxTems)])
    .range([innerHeight, 0]);

  const timeTicks = xScale.ticks();
  const formatMonth = d3.timeFormat("%b");

  const yTicks = yScale.ticks();

  const pathGenerator = d3
    .line<Data>()
    .x((d) => xScale(d.date))
    .y((d) => yScale(d.avg_temp_F))
    .curve(d3.curveCatmullRom);

  const areaGenerator = d3
    .area<Data>()
    .x0((d) => xScale(d.date))
    .x1((d) => xScale(d.date))
    .y0((d) => yScale(d.max_temp_F))
    .y1((d) => yScale(d.min_temp_F))
    .curve(d3.curveCatmullRom);

  return (
    <div>
      <ChartContainer
        viewWidth={width}
        viewHeight={height}
        margin={margin}
        css={css`
          max-width: 960px;
        `}
      >
        <g className="path">
          <path d={pathGenerator(data)} fill="none" stroke="steelblue" />
        </g>
        <g className="area">
          <path d={areaGenerator(data)} fillOpacity={0.2} />
        </g>
        <g className="arc">
          {data.map((d) => {
            return (
              <circle
                key={d.date.toString()}
                cx={xScale(d.date)}
                cy={yScale(d.avg_temp_F)}
                r={2}
              />
            );
          })}
        </g>
        <g className="x-axis" transform={`translate(0, ${innerHeight})`}>
          <line x1={0} y1={0} x2={innerWidth} y2={0} stroke="red" />
          {timeTicks.map((d) => {
            const currentMonth = d;
            const nextMonth = new Date(2021, currentMonth.getMonth() + 1, 1);
            const offset = (xScale(nextMonth) - xScale(currentMonth)) / 2;
            return (
              <g key={d.toString()}>
                <text x={xScale(d) + offset} y={24} textAnchor="middle">
                  {formatMonth(d)}
                </text>
                <line
                  x1={xScale(d)}
                  y1={0}
                  x2={xScale(d)}
                  y2={10}
                  stroke="red"
                />
              </g>
            );
          })}
        </g>
        <g className="y-axis">
          <line x1={0} y1={0} x2={0} y2={innerHeight} stroke="red" />
          {yTicks.map((d) => {
            return (
              <g key={d}>
                <text
                  x={-15}
                  y={yScale(d)}
                  textAnchor="end"
                  alignmentBaseline="central"
                >
                  {d}
                </text>
                <line
                  x1={0}
                  x2={-10}
                  y1={yScale(d)}
                  y2={yScale(d)}
                  stroke="red"
                />
              </g>
            );
          })}
        </g>
        <g className="label">
          <text textAnchor="middle" x={0} y={-25} alignmentBaseline="central">
            温度(°F)
          </text>
        </g>
      </ChartContainer>
    </div>
  );
}

export default LineChart;
