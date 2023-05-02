import "normalize.css"

import Chart from "./components/Chart"
import { css } from "@emotion/react"
import { useState } from "react"
import * as d3 from "d3"
function generateNonDuplicateArray(count: number) {
  const array = []
  for (let i = 0; i < 100; i++) {
    array.push(i)
  }

  const result = []
  for (let i = 0; i < count; i++) {
    const index = Math.floor(Math.random() * array.length)
    result.push(array[index])
    array.splice(index, 1)
  }

  return result
}

function App() {
  const [data, setData] = useState(() => generateNonDuplicateArray(20))

  function handleSort() {
    console.log("click")
  }

  function handleShuffle() {
    const next = d3.shuffle([...data])
    setData(next)
  }
  function handleGenRandom() {
    const next = generateNonDuplicateArray(20)
    setData(next)
  }

  return (
    <div
      className="sort-viz"
      css={css`
        margin-left: auto;
        margin-right: auto;
        max-width: 1200px;
      `}
    >
      <h2>Chart</h2>
      <div>
        <button onClick={handleSort}>sort</button>
        <button onClick={handleShuffle}>suffle</button>
        <button onClick={handleGenRandom}>random</button>
      </div>
      <Chart data={data} />
    </div>
  )
}

export default App
