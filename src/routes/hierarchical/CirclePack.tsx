import { CirclePackProps, Flat, Layout } from "./types";
import ChartContainer from "../../components/ChartContainer";
import { Box, Card, CardContent } from "@mui/material";
import * as d3 from "d3";
import { colorScale } from "./scale";
function CirclePack({ data }: CirclePackProps) {
  const width = 800;
  const height = 800;
  const margin = { top: 1, right: 1, bottom: 1, left: 1 };
  const innerWidth = width - margin.right - margin.left;
  const innerHeight = height - margin.top - margin.bottom;
  // debugger;
  const [root, descendants, leaves] = data;

  root.sum((d) => d.total_speakers);
  const packLayoutGenerator = d3.pack().size([innerWidth, innerHeight]);
  packLayoutGenerator(root);

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
              {descendants.map((d: d3.HierarchyNode<Flat> & Layout) => {
                function getColor(d: d3.HierarchyNode<Flat> & Layout): string {
                  switch (d.depth) {
                    case 1:
                      return colorScale(d.id);
                    case 2:
                      return d3.interpolate(
                        colorScale(d.parent.id),
                        "white"
                      )(0.5);
                    default:
                      return "white";
                  }
                }
                const fill = getColor(d);
                return (
                  <g key={d.id}>
                    <circle
                      cx={d.x}
                      cy={d.y}
                      r={d.r}
                      fill={fill}
                      stroke={d.depth === 0 ? "grey" : "none"}
                    />
                  </g>
                );
              })}
              {leaves.map((d: d3.HierarchyNode<Flat> & Layout) => {
                return (
                  d.r > 40 && (
                    <text
                      key={d.id}
                      x={d.x}
                      y={d.y}
                      textAnchor="middle"
                      alignmentBaseline="central"
                    >
                      {d.id}
                    </text>
                  )
                );
              })}
            </ChartContainer>
          </Box>
        </CardContent>
      </Card>
    </div>
  );
}

export default CirclePack;
