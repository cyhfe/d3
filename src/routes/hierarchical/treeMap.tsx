import { CirclePackProps, Flat, Layout } from "./types";
import ChartContainer from "../../components/ChartContainer";
import { Box, Card, CardContent } from "@mui/material";
import * as d3 from "d3";
import { colorScale, getRadius } from "./scale";

function TreeMap({ data }: CirclePackProps) {
  const width = 1200;
  const height = 3000;
  const margin = { top: 60, right: 200, bottom: 0, left: 100 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  // debugger;
  const [root, descendants, leaves] = data;

  const treeLayoutGenerator = d3.tree().size([innerHeight, innerWidth]);
  treeLayoutGenerator(root);

  const linkGenerator = d3
    .link<d3.HierarchyLink<Flat>, d3.HierarchyNode<Flat> & Layout>(
      d3.curveBumpX
    )
    .x((d) => {
      return d.y;
    })
    .y((d) => d.x);

  const links = root.links();
  const maxSpeakers = d3.max(leaves, (d) => d.data.total_speakers);
  return (
    <div>
      <Card>
        <CardContent>
          <Box
            mb={4}
            sx={{ maxWidth: " 720px", marginLeft: "auto", marginRight: "auto" }}
          >
            <ChartContainer
              viewHeight={height}
              viewWidth={width}
              margin={margin}
            >
              <rect
                width={innerWidth}
                height={innerHeight}
                stroke="red"
                fill="none"
              />
              {links.map((link) => {
                return (
                  <path
                    d={linkGenerator(link)}
                    fill="none"
                    stroke="gray"
                    strokeOpacity={0.6}
                  />
                );
              })}

              {descendants.map((d: d3.HierarchyNode<Flat> & Layout) => {
                return (
                  <circle
                    cx={d.y}
                    cy={d.x}
                    r={
                      d.depth === 3
                        ? getRadius(maxSpeakers, d.data.total_speakers)
                        : 4
                    }
                    fill={
                      d.depth === 3 ? colorScale(d.parent.data.parent) : "white"
                    }
                    fillOpacity={d.depth === 3 ? 0.3 : 1}
                    stroke={d.depth === 3 ? "none" : "grey"}
                  />
                );
              })}

              {descendants.map((d: d3.HierarchyNode<Flat> & Layout) => {
                return (
                  <text
                    x={d.children ? d.y - 8 : d.y + 8}
                    y={d.x}
                    textAnchor={d.children ? "end" : "start"}
                    alignmentBaseline="middle"
                    paintOrder={"stroke"}
                    fontSize={16}
                  >
                    {d.id}
                  </text>
                );
              })}
            </ChartContainer>
          </Box>
        </CardContent>
      </Card>
    </div>
  );
}

export default TreeMap;
