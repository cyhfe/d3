import { useState } from "react"
import "normalize.css"
import { css } from "@emotion/react"

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <p
          css={css`
            color: red;
          `}
        >
          abc
        </p>
      </div>
    </>
  )
}

export default App
