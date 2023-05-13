import ChartContainer from "../../components/ChartContainer";
import { useMemo, useState } from "react";
import { css } from "@emotion/react";
import * as d3 from "d3";
import BarShape from "./BarShape";
import { Box, Card, CardContent } from "@mui/material";
interface ChartProps {
  data: number[];
}

const lineStyle = css`
  stroke: #888b8d;
`;

const textStyle = css`
  font-size: 10px;
  fill: #374f5e;
`;

function Chart({ data }: ChartProps) {
  const viewWidth = 500;
  const viewHeight = 250;
  const margin = {
    top: 30,
    bottom: 40,
    left: 60,
    right: 30,
  };

  const innerWidth = viewWidth - margin.left - margin.right;
  const innerHeight = viewHeight - margin.top - margin.bottom;

  const xDomain = useMemo(() => {
    return Array.from(d3.range(0, data.length), (n) => String(n));
  }, [data.length]);

  const xScale = useMemo(() => {
    return d3.scaleBand().domain(xDomain).range([0, innerWidth]).padding(0.2);
  }, [innerWidth, xDomain]);

  const yScale = useMemo(() => {
    return d3.scaleLinear().domain([0, 100]).range([innerHeight, 0]).nice();
  }, [innerHeight]);

  const yTicks = yScale.ticks(10);

  const count = Math.min(data.length, 10);
  const ticks = d3.ticks(0, data.length - 1, count);

  return (
    <Card>
      <CardContent>
        <Box sx={{ maxWidth: "960px" }}>
          <ChartContainer
            viewWidth={viewWidth}
            viewHeight={viewHeight}
            margin={margin}
          >
            {/* x 轴 */}
            <g transform={`translate(0, ${innerHeight})`} className="x-axis">
              <line
                x1={0}
                y1={0}
                x2={innerWidth}
                y2={0}
                stroke="black"
                css={lineStyle}
              />
              {ticks.map((t) => {
                const offset =
                  (xScale(String(t)) as number) + xScale.bandwidth() / 2;
                return (
                  <g key={t} transform={`translate(${offset}, 0)`}>
                    <text
                      x={0}
                      y={6}
                      textAnchor="middle"
                      alignmentBaseline="hanging"
                      fontSize={8}
                      css={textStyle}
                    >
                      {t}
                    </text>
                    <line
                      x1={0}
                      y1={0}
                      x2={0}
                      y2={3}
                      stroke="black"
                      css={lineStyle}
                    ></line>
                  </g>
                );
              })}

              {/* label */}
              <text
                x={innerWidth / 2}
                y={20}
                textAnchor="middle"
                alignmentBaseline="hanging"
                css={textStyle}
              >
                Index
              </text>
            </g>

            {/* y 轴 */}
            <g className="y-axis">
              <line
                x1={0}
                y1={0}
                x2={0}
                y2={innerHeight}
                stroke="black"
                strokeWidth={1}
                css={lineStyle}
              />
              {yTicks.map((v) => {
                return (
                  <g transform={`translate(0, ${yScale(v)})`} key={v}>
                    <text
                      css={textStyle}
                      textAnchor="end"
                      alignmentBaseline="central"
                      x={-6}
                      y={0}
                    >
                      {v}
                    </text>
                    <line x1={0} y1={0} x2={-3} y2={0} css={lineStyle} />
                  </g>
                );
              })}
              <g>
                <text
                  x={-innerHeight / 2}
                  y={-35}
                  textAnchor="middle"
                  alignmentBaseline="baseline"
                  fontSize={10}
                  transform={"rotate(-90)"}
                  css={textStyle}
                >
                  Value
                </text>
              </g>
            </g>

            {/* {柱状图} */}
            <BarShape
              data={data}
              innerHeight={innerHeight}
              xScale={xScale}
              yScale={yScale}
            />
          </ChartContainer>
        </Box>
      </CardContent>
    </Card>
  );
}

export default Chart;
