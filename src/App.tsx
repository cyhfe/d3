import "normalize.css"

import Chart from "./components/Chart"
import { css } from "@emotion/react"
import { useState } from "react"

function getRandomArray(n = 20) {
  return Array.from(new Array(n), () => {
    return Math.round(Math.random() * 100)
  })
}

function App() {
  const [data, setData] = useState(() => getRandomArray())

  function handleSort() {
    console.log("click")
  }

  function handleGenRandom() {
    setData(getRandomArray())
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
        <button onClick={handleGenRandom}>random</button>
      </div>
      <Chart data={data} />
    </div>
  )
}

export default App
