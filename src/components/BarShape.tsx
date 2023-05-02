import * as d3 from "d3"
import { useCallback, useEffect, useRef } from "react"
interface BarShapeProps {
  data: number[]
  innerHeight: number
  yScale: d3.ScaleLinear<number, number, never>
  xScale: d3.ScaleBand<string>
}
function BarShape({ data, innerHeight, xScale, yScale }: BarShapeProps) {
  const barGroup = useRef<SVGGElement | null>(null)

  const draw = useCallback(
    function draw() {
      console.log("draw")

      const rects = d3.select(barGroup.current).selectAll("rect")

      rects
        .data(data, (d) => d as number)
        .join(
          // "rect"
          (enter) => {
            const nextEnter = enter
              .append("rect")
              .attr("x", (_, i) => xScale(String(i)) as number)
              .attr("y", innerHeight)
              .attr("width", xScale.bandwidth())
              .attr("height", 0)
              .call((enter) =>
                enter.call((enter) =>
                  enter
                    .transition()
                    .duration(1000)
                    .attr("y", (d) => yScale(d))
                    .attr("height", (d) => innerHeight - yScale(d))
                )
              )
            console.log(nextEnter)
            return nextEnter
          },
          (update) =>
            update
              .attr("y", (d) => yScale(d))
              // .attr("width", xScale.bandwidth())
              .attr("height", (d) => innerHeight - yScale(d))
              .call((update) =>
                update
                  .transition()
                  .duration(1000)
                  .attr("x", (_, i) => xScale(String(i)) as number)
              ),
          (exit) => {
            console.log(exit, "exit")
            return exit.attr("fill", "red").remove()
          }
          // (enter) =>
          //   enter
          //     .append("rect")
          //     .attr("x", (_, i) => xScale(String(i)) as number)
          //     .attr("y", innerHeight)
          //     .attr("height", 0)
          //     .attr("width", xScale.bandwidth())
          //     .attr("fill", "blue")
          //     .call((enter) =>
          //       enter
          //         .transition()
          //         .duration(1000)
          //         .attr("height", (v) => innerHeight - yScale(v))
          //         .attr("y", (v) => yScale(v))
          //         .attr("fill", "black")
          //     )
          // (update) => {
          //   console.log(update)

          //   return update
          //     .attr("fill", "green")
          //     .call((update) =>
          //       update
          //         .transition()
          //         .delay(1000)
          //         .duration(1000)
          //         .attr("fill", "black")
          //     )
          // },
          // (exit) => {
          //   return exit
          //     .attr("fill", "red")
          //     .call((exit) =>
          //       exit
          //         .transition()
          //         .delay(1000)
          //         .duration(1000)
          //         .attr("fill", "black")
          //         .remove()
          //     )
          // }
        )
      // .attr("x", (_, i) => xScale(String(i)) as number)
      // .attr("y", (d) => yScale(d))
      // .attr("width", xScale.bandwidth())
      // .attr("height", (d) => innerHeight - yScale(d))
      // x={xScale(String(i))}
      // y={yScale(n)}
      // width={xScale.bandwidth()}
      // height={innerHeight - yScale(n)}
      return rects
    },
    [data, innerHeight, xScale, yScale]
  )

  useEffect(() => {
    draw()
  }, [data, draw, innerHeight, xScale, yScale])
  return (
    <g className="bar-shape" ref={barGroup}>
      {/* {data.map((n, i) => {
        return (
          <rect
            key={n + "-" + i}
            x={xScale(String(i))}
            y={yScale(n)}
            width={xScale.bandwidth()}
            height={innerHeight - yScale(n)}
          />
        )
      })} */}
    </g>
  )
}

export default BarShape
