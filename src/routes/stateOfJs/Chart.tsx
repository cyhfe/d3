import { useEffect, useRef } from "react";
import * as d3 from "d3";
import ChartContainer from "../../components/ChartContainer";

import type { Data, FilteredData, Rank } from "./types";

const width = 640;
const height = 400;
const margin = {
  top: 20,
  right: 20,
  bottom: 30,
  left: 40,
};

const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;

interface ChartProps {
  data: Data;
  filter: string;
}

function Chart({ data, filter }: ChartProps) {
  const groupRef = useRef<SVGGElement>(null);

  // useEffect(() => {
  //   const r = data;
  //   debugger;
  // }, [data]);

  useEffect(() => {
    function update(data: Data, filter: string) {
      if (!groupRef.current) return;
      const xDomain = d3.map(data.years, (y) => String(y));
      const yDomain = d3.map(d3.range(1, data.items.length + 1), (n) =>
        String(n)
      );
      const xScale = d3.scalePoint().domain(xDomain).range([0, innerWidth]);

      const yScale = d3.scalePoint().domain(yDomain).range([0, innerHeight]);

      const xAxisGenerator = d3.axisBottom(xScale);

      const yAxisGenerator = d3.axisLeft(yScale);

      const pathGenerator = d3
        .line<Rank>()
        .x((d) => {
          return Number(xScale(String(d.year)));
        })
        .y((d) => Number(yScale(String(d.rank))) - innerHeight)
        .defined((d) => d.rank !== null)
        .curve(d3.curveMonotoneX);

      const rootGroup = d3.select(groupRef.current);

      const chartGroup = rootGroup.append("g").attr("class", "chartGroup");

      const pathGroup = chartGroup
        .append("g")
        .attr("transform", `translate(0, ${innerHeight})`);

      pathGroup
        .selectAll("path")
        .data(data.items)
        .join("path")
        .attr("d", (d) => pathGenerator(d[filter]))
        .attr("fill", "none")
        .attr("stroke", "blue");

      const xAxis = chartGroup.append("g");
      xAxis.attr("transform", `translate(0, ${innerHeight})`);
      xAxis.call(xAxisGenerator).select(".domain").remove();
      xAxis.selectAll(".tick line").remove();

      const valueGroup = chartGroup
        .append("g")
        .selectAll("text")
        .data(data.items)
        .join("g")
        .append("g")
        .selectAll("text")
        .data<Rank>((d) => d[filter].filter((d: Rank) => d.rank !== null))
        .join("text")
        .text((d) => {
          return Math.round(d.percentageQuestion);
        })
        .attr("transform", `translate(0, ${innerHeight})`)
        .attr("x", (d) => Number(xScale(String(d.year))))
        .attr("y", (d) => Number(yScale(String(d.rank))) - innerHeight)
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "central");

      return () => {
        chartGroup.remove();
      };
    }

    const remove = update(data, filter);
    return () => {
      remove?.();
    };
  }, [data, filter]);
  return (
    <ChartContainer viewWidth={width} viewHeight={height} margin={margin}>
      <g ref={groupRef}></g>
    </ChartContainer>
  );
}

export default Chart;
