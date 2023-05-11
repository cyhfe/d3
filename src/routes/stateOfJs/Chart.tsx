import { useEffect, useRef } from "react";
import * as d3 from "d3";
import ChartContainer from "../../components/ChartContainer";

import type { Data, Rank, Item } from "./types";

const width = 650;
const height = 400;
const margin = {
  top: 30,
  right: 120,
  bottom: 30,
  left: 120,
};

const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;

interface ChartProps {
  data: Data;
  filter: string;
}

function Chart({ data, filter }: ChartProps) {
  const groupRef = useRef<SVGGElement>(null);
  useEffect(() => {
    function update(data: Data, filter: string) {
      if (!groupRef.current) return;
      const xDomain = d3.map(data.years, (y) => String(y));
      const yDomain = d3.map(d3.range(1, data.items.length + 1), (n) =>
        String(n)
      );
      const xScale = d3.scalePoint().domain(xDomain).range([0, innerWidth]);

      const yScale = d3.scalePoint().domain(yDomain).range([0, innerHeight]);
      const ids = data.items.map((i) => i.id);
      const colorScale = d3
        .scaleOrdinal()
        .domain(ids)
        .range(d3.schemeTableau10);

      const xAxisGenerator = d3.axisBottom(xScale);

      const pathGenerator = d3
        .line<Rank>()
        .x((d) => {
          return Number(xScale(String(d.year)));
        })
        .y((d) => Number(yScale(String(d.rank))) - innerHeight)
        .defined((d) => d.rank !== null)
        .curve(d3.curveMonotoneX);

      const rootGroup = d3.select(groupRef.current);

      const chartGroup = rootGroup.select(".chartGroup");

      const transition = d3.transition().duration(300).ease(d3.easeCubicOut);

      const pathGroup = chartGroup
        .select(".pathGroup")
        .attr("transform", `translate(0, ${innerHeight})`);

      pathGroup
        .selectAll<SVGPathElement, Item>("path")
        .data<Item>(data.items, (d) => d.id)
        .join("path")
        .attr("stroke", (d) => String(colorScale(d.id)))
        .attr("stroke-width", 3)
        .attr("fill", "none")
        .transition(transition)
        .attr("d", (d) => pathGenerator(d[filter]));

      const xAxis = chartGroup.select<SVGGElement>(".xAxis");
      xAxis.attr("transform", `translate(0, ${innerHeight})`);
      xAxis.call(xAxisGenerator).select(".domain").remove();
      xAxis.selectAll(".tick line").remove();

      const itemGroup = chartGroup.select(".itemGroup");

      const items = itemGroup
        .selectAll<SVGGElement, Item>("g")
        .data<Item>(data.items, (d) => d.id)
        .join("g")
        .attr("class", "item")
        .append("g");

      const textGroup = items

        .selectAll("g")
        .data<Rank & { id: string }>((d) => {
          return d[filter]
            .filter((d: Rank) => d.rank !== null)
            .map((n: Rank) => ({ ...n, id: d.id }));
        })
        .join("g")
        .attr(
          "transform",
          (d: Rank) =>
            `translate(${Number(xScale(String(d.year)))}, ${Number(
              yScale(String(d.rank))
            )})`
        );

      textGroup
        .append("circle")
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("r", 8)
        .attr("fill", "white")
        .attr("stroke", (d) => {
          return String(colorScale(d.id));
        })
        .attr("stroke-width", 2);

      textGroup
        .append("text")
        .text((d) => {
          return Math.round(d.percentageQuestion);
        })
        .attr("fill", "black")
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "central")
        .attr("font-size", 6)
        .attr("font-weight", "bold");

      const offsetItemsLeft = itemGroup
        .selectAll(".item")
        .filter((d) => {
          return d[filter][0].rank !== null;
        })
        .append("g")
        .attr("font-weight", "bold")
        .attr("font-size", "10")
        .call((itemGroup) => {
          itemGroup
            // .attr("transform", (d) => {
            //   // const offsetY = yScale(String(d[filter][0].rank));
            //   return `translate(-18, 0)`;
            // })
            .attr("class", "offsetItem")
            .transition()
            .duration(300)
            .attr("transform", (d) => {
              const offsetY = yScale(String(d[filter][0].rank));
              return `translate(-18, ${offsetY})`;
            });
        }) as d3.Selection<SVGGElement, Rank & { id: string }, null, undefined>;

      offsetItemsLeft
        .append("text")
        .text((d) => d.id)
        // .transition(transition)
        .attr("fill", (d) => String(colorScale(d.id)))
        .attr("text-anchor", "end")
        .attr("alignment-baseline", "central");

      const offsetItemsRight = itemGroup
        .selectAll(".item")
        .filter((d) => {
          return d[filter][d[filter].length - 1].rank !== null;
        })
        .append("g")
        .attr("font-weight", "bold")
        .attr("font-size", "10")
        .attr("transform", (d) => {
          const offsetY = yScale(String(d[filter][d[filter].length - 1].rank));
          return `translate(${innerWidth + 18}, ${offsetY})`;
        })
        .attr("class", "offsetItem") as d3.Selection<
        SVGGElement,
        Rank & { id: string },
        null,
        undefined
      >;

      offsetItemsRight
        .append("text")
        .text((d) => d.id)
        .attr("fill", (d) => String(colorScale(d.id)))
        .attr("text-anchor", "start")
        .attr("alignment-baseline", "central");

      return () => {
        chartGroup.remove();
      };
    }

    const remove = update(data, filter);
    return () => {
      // remove?.();
    };
  }, [data, filter]);
  return (
    <ChartContainer
      viewWidth={width}
      viewHeight={height}
      margin={margin}
      style={{
        maxWidth: "1200px",
      }}
    >
      <g ref={groupRef} className="rootGroup">
        <g className="chartGroup">
          <g className="pathGroup"></g>
          <g className="xAxis"></g>
          <g className="itemGroup"></g>
        </g>
      </g>
    </ChartContainer>
  );
}

export default Chart;
