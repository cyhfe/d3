import * as d3 from "d3";
import ChartContainer from "../../components/ChartContainer";
import { Data, LineChartProps } from "./types";
import { css } from "@emotion/react";

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

  const dates = d3.map(data, (d) => d.date);
  const maxTems = d3.map(data, (d) => d.max_temp_F);

  const xScale = d3.scaleTime().domain(d3.extent(dates)).range([0, innerWidth]);
  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(maxTems)])
    .range([innerHeight, 0]);

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
        <g className="arc"></g>
        <g className="x-axis">
          <line
            x1={0}
            y1={0}
            x2={innerWidth}
            y2={0}
            stroke="red"
            transform={`translate(0, ${innerHeight})`}
          />
        </g>
        <g className="y-axis">
          <line x1={0} y1={0} x2={0} y2={innerHeight} stroke="red" />
        </g>
      </ChartContainer>
    </div>
  );
}

export default LineChart;
