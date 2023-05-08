import { css } from "@emotion/react";
import { useScale } from "./useScale";
function Keyboard() {
  // const { keys, xScale } = useScale();
  // console.log(keys);

  return (
    <svg
      css={css`
        display: block;
      `}
      viewBox="0 ,0, 600, 300"
      width={"100%"}
      height={"10vh"}
      preserveAspectRatio="none"
      // fill="blue"
    >
      {/* <rect x={0} y={0} width={100} height={300} fill="blue"></rect> */}

      <g></g>
      {/* {keys.map((key) => {
        console.log(key, xScale(key));
        return (
          <rect
            x={xScale(key)}
            y={0}
            width={xScale.bandwidth()}
            height={300}
            key={key}
            fill="blue"
          ></rect>
        );
      })} */}
    </svg>
  );
}

export default Keyboard;
