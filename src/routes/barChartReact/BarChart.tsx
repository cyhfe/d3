import * as d3 from "d3";
import ChartContainer from "../../components/ChartContainer";

import type { DataList } from "./types";
import { css } from "@emotion/react";

const width = 640;
const height = 400;
const margin = {
  top: 20,
  right: 20,
  bottom: 30,
  left: 40,
};

const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;

interface BarChartProps {
  data: DataList;
}

const axisTextStyle = css`
  fill: #37474f;
  font-size: 10px;
`;

const axisLineStyle = css`
  stroke: #37474f;
`;

function BarChart({ data }: BarChartProps) {
  const sortedData = d3.sort(data, (a, b) =>
    d3.descending(a.frequency, b.frequency)
  );
  const xDomain = sortedData.map((d) => d.letter);
  const yDomain = [0, d3.max(data, (d) => d.frequency)];

  const xScale = d3.scaleBand(xDomain, [0, innerWidth]).padding(0.1);
  const yScale = d3.scaleLinear(yDomain, [innerHeight, 0]);

  const yTicks = yScale.ticks(6);
  return (
    <ChartContainer width={width} height={height} margin={margin}>
      <g className="rects">
        {data.map((d) => {
          return (
            <rect
              key={d.letter}
              x={xScale(d.letter)}
              y={yScale(d.frequency)}
              width={xScale.bandwidth()}
              height={innerHeight - yScale(d.frequency)}
              fill={"steelblue"}
            />
          );
        })}
      </g>
      <g className="x-axis" transform={`translate(0, ${innerHeight})`}>
        <line x1={0} y1={0} x2={innerWidth} y2={0} css={axisLineStyle} />
        {data.map((d) => {
          const xOffset = xScale(d.letter) + xScale.bandwidth() / 2;
          return (
            <g key={d.letter}>
              <line
                x1={xOffset}
                y1={0}
                x2={xOffset}
                y2={5}
                css={axisLineStyle}
              />
              <text
                alignmentBaseline="hanging"
                textAnchor={"middle"}
                x={xOffset}
                y={8}
                css={axisTextStyle}
              >
                {d.letter}
              </text>
            </g>
          );
        })}
      </g>
      <g className="y-axis">
        <line x1={0} y1={0} x2={0} y2={innerHeight} css={axisLineStyle} />
        {yTicks.map((d) => {
          return (
            <g key={d}>
              <line
                x1={0}
                y1={yScale(d)}
                x2={-5}
                y2={yScale(d)}
                css={axisLineStyle}
              />
              <text
                css={axisTextStyle}
                alignmentBaseline="central"
                textAnchor={"end"}
                y={yScale(d)}
                x={-10}
              >
                {d * 100 + "%"}
              </text>
            </g>
          );
        })}
      </g>
    </ChartContainer>
  );
}

export default BarChart;
