import ChartContainer from "./ChartContainer"
import { useState } from "react"
import { css } from "@emotion/react"
import * as d3 from "d3"

function getRandomArray(n = 20) {
  return Array.from(new Array(n), () => {
    return Math.round(Math.random() * 100)
  })
}
function Chart() {
  const [data, setData] = useState(() => getRandomArray())

  const viewWidth = 500
  const viewHeight = 250
  const margin = {
    top: 50,
    bottom: 50,
    left: 50,
    right: 50,
  }

  const innerWidth = viewWidth - margin.left - margin.right
  const innerHeight = viewHeight - margin.top - margin.bottom

  const xDomain = Array.from(d3.range(0, data.length), (n) => String(n))

  const xScale = d3
    .scaleBand()
    .domain(xDomain)
    .range([0, innerWidth])
    .padding(0.2)

  const yScale = d3
    .scaleLinear()
    .domain([0, 100])
    .range([innerHeight, 0])
    .nice()

  const yTicks = yScale.ticks(10)

  const count = Math.min(data.length, 10)
  const ticks = d3.ticks(0, data.length - 1, count)
  console.log(yTicks)

  return (
    <div>
      <ChartContainer
        viewWidth={viewWidth}
        viewHeight={viewHeight}
        margin={margin}
      >
        {/* x 轴 */}
        <g transform={`translate(0, ${innerHeight})`} className="x-axis">
          <line x1={0} y1={0} x2={innerWidth} y2={0} stroke="black" />
          {ticks.map((t) => {
            const offset =
              (xScale(String(t)) as number) + xScale.bandwidth() / 2
            return (
              <g key={t} transform={`translate(${offset}, 0)`}>
                <text
                  x={0}
                  y={6}
                  textAnchor="middle"
                  alignmentBaseline="hanging"
                  fontSize={8}
                >
                  {t}
                </text>
                <line x1={0} y1={0} x2={0} y2={3} stroke="black"></line>
              </g>
            )
          })}

          {/* label */}
          <text
            x={innerWidth / 2}
            y={20}
            textAnchor="middle"
            alignmentBaseline="hanging"
            fontSize={10}
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
          />
          {yTicks.map((v) => {
            return (
              <g transform={`translate(0, ${yScale(v)})`} key={v}>
                <text
                  fontSize={8}
                  textAnchor="end"
                  alignmentBaseline="central"
                  x={-6}
                  y={0}
                >
                  {v}
                </text>
                <line x1={0} y1={0} x2={-3} y2={0} stroke="black" />
              </g>
            )
          })}
        </g>

        {/* {柱状图} */}
        <g className="shape">
          {data.map((n, i) => {
            return (
              <rect
                key={i}
                x={xScale(String(i))}
                y={yScale(n)}
                width={xScale.bandwidth()}
                height={innerHeight - yScale(n)}
              />
            )
          })}
        </g>

        {/* xaxis
        yaxis
        shape
        label */}
      </ChartContainer>
    </div>
  )
}

export default Chart
