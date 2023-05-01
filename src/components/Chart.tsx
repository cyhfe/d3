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

  const viewWidth = 300
  const viewHeight = 150
  const margin = {
    top: 20,
    bottom: 20,
    left: 20,
    right: 20,
  }

  const innerWidth = viewWidth - margin.left - margin.right
  const innerHeight = viewHeight - margin.top - margin.bottom

  // const a = Array.from(d3.range(0, data.length - 1), n => n + '')

  const xScale = d3
    .scaleBand()
    .domain(Array.from(d3.range(0, data.length), (n) => String(n)))
    .range([0, innerWidth])
    .padding(0.2)

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(data) ?? 0])
    .range([innerHeight, 0])

  // const a = xScale.step()

  return (
    <div>
      <ChartContainer
        viewWidth={viewWidth}
        viewHeight={viewHeight}
        margin={margin}
      >
        {/* x 轴 */}
        <g transform={`translate(0, ${innerHeight})`}>
          <line x1={0} y1={0} x2={innerWidth} y2={0} stroke="black" />
          {data.map((n, i) => {
            return (
              <g key={i}>
                <text
                  x={(xScale(String(i)) as number) + xScale.bandwidth() / 2}
                  y={2}
                  textAnchor="middle"
                  alignmentBaseline="hanging"
                  style={{
                    fontSize: 8,
                  }}
                >
                  {i}
                </text>
                <line></line>
              </g>
            )
          })}
        </g>

        {/* y 轴 */}
        <g>
          <line
            x1={0}
            y1={0}
            x2={0}
            y2={innerHeight}
            stroke="black"
            strokeWidth={1}
          />
          {data.map((n, i) => {
            // <g>
            //   <text></text>
            //   <line></line>
            // </g>
            return null
          })}
        </g>

        {/* {柱状图} */}
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
        {/* xaxis
        yaxis
        shape
        label */}
      </ChartContainer>
    </div>
  )
}

export default Chart
