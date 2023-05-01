import "normalize.css"

import Chart from "./components/Chart"
import { css } from "@emotion/react"

// ;[1, 2, 3]
function App() {
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
      <Chart />
    </div>
  )
}

export default App
