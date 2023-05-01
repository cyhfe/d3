import ChartContainer from "./ChartContainer"
import { useState } from "react"
import { css } from "@emotion/react"

function getRandomArray(n = 10) {
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
  return (
    <div>
      <ChartContainer
        viewWidth={viewWidth}
        viewHeight={viewHeight}
        margin={margin}
      >
        <rect x={0} y={0} width={innerWidth} height={innerHeight} fill="red" />
      </ChartContainer>
    </div>
  )
}

export default Chart
