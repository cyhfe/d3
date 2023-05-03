import { css } from "@emotion/react";

interface Margin {
  top: number;
  left: number;
  bottom: number;
  right: number;
}

interface ChartContainerProps extends React.ComponentPropsWithoutRef<"svg"> {
  children?: React.ReactNode;
  width?: number;
  height?: number;
  viewWidth?: number;
  viewHeight?: number;
  margin?: Margin;
}

function ChartContainer({
  children,
  width,
  height,
  viewWidth = 350,
  viewHeight = 100,
  margin = {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  ...rest
}: ChartContainerProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0, 0, ${viewWidth}, ${viewHeight}`}
      {...rest}
    >
      <g transform={`translate(${margin.left}, ${margin.top})`}>{children}</g>
    </svg>
  );
}

export default ChartContainer;
