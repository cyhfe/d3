import { css } from "@emotion/react"
interface Margin {
  top: number
  left: number
  bottom: number
  right: number
}

interface ChartContainerProps extends React.ComponentPropsWithoutRef<"svg"> {
  children?: React.ReactNode
  width?: number
  height?: number
  viewWidth: number
  viewHeight: number
  margin: Margin
}

function ChartContainer({
  children,
  width,
  height,
  viewWidth,
  viewHeight,
  margin,
  ...rest
}: ChartContainerProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0, 0, ${viewWidth}, ${viewHeight}`}
      css={css`
        outline: 1px solid blue;
      `}
      {...rest}
    >
      <g transform={`translate(${margin.left}, ${margin.top})`}>{children}</g>
    </svg>
  )
}

export default ChartContainer
