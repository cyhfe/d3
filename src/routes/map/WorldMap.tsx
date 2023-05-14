import { useState } from "react";
import { WorldMapProps } from "./types";
import ChartContainer from "../../components/ChartContainer";

import * as d3 from "d3";
import { Box, Button, ButtonGroup, Card, CardContent } from "@mui/material";
import { Tooltip, useTooltip } from "@visx/tooltip";
import { GradientPinkBlue } from "@visx/gradient";

function WorldMap({ world, city }: WorldMapProps) {
  const [mode, setMode] = useState<"city" | "country">("city");
  const width = 1230;
  const height = 720;

  const margin = {
    left: 50,
    bottom: 50,
    top: 80,
    right: 50,
  };

  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const projection = d3
    .geoEqualEarth()
    .translate([innerWidth / 2, innerHeight / 2])
    .scale(220);

  const geoPathGenerator = d3.geoPath().projection(projection);

  const graticuleGenerator = d3.geoGraticule();

  const colorScale = d3.scaleSequential(d3.interpolateYlGnBu).domain([1, 100]);

  const laureatesMax = d3.max(d3.map(city, (d) => d.laureates.length));
  const laureatesMedium = 50;
  const laureatesMin = 5;

  const cityScale = d3.scaleRadial().domain([0, laureatesMax]).range([0, 25]);

  const maxRadius = 25;
  const mediumRadius = cityScale(laureatesMedium);
  const minRadius = cityScale(laureatesMin);
  const linesLength = 50;

  const {
    showTooltip,
    hideTooltip,
    tooltipOpen,
    tooltipData,
    tooltipLeft = 0,
    tooltipTop = 0,
  } = useTooltip<string>({
    tooltipOpen: false,
  });

  return (
    <div>
      <Card>
        <CardContent>
          <Box mb={2}>
            <ButtonGroup>
              <Button
                onClick={() => setMode("city")}
                color={mode === "country" ? "primary" : "secondary"}
              >
                按城市
              </Button>
              <Button
                onClick={() => setMode("country")}
                color={mode === "city" ? "primary" : "secondary"}
              >
                按国家
              </Button>
            </ButtonGroup>
          </Box>
          <ChartContainer viewHeight={height} viewWidth={width} margin={margin}>
            <defs>
              <linearGradient id="Gradient1">
                <stop stopColor={"rgba(255,255,217,1)"} offset="0%" />
                <stop stopColor={"rgba(76,183,193,1)"} offset="50%" />
                <stop stopColor={"rgba(9,30,90,1)"} offset="100%" />
              </linearGradient>
            </defs>
            <GradientPinkBlue id="pinkblue" />
            {/* outline */}
            <rect
              x={-margin.left}
              y={-margin.top}
              width={width}
              height={height}
              stroke="url(#pinkblue)"
              fill="none"
              strokeDasharray={"6, 4"}
              strokeWidth={2}
            />
            {/* city legend */}
            {mode === "city" && (
              <g fill={"transparent"} stroke={"#09131b"} x={0} y={0}>
                <text x={-maxRadius} y={-50} fill={"#09131b"} stroke="none">
                  比例尺: 获奖人数对应半径
                </text>
                <g>
                  <circle cx={0} cy={maxRadius - minRadius} r={minRadius} />
                  <line
                    x1={0}
                    y1={maxRadius - 2 * minRadius}
                    x2={linesLength}
                    y2={maxRadius - 2 * minRadius}
                    strokeDasharray={"6 4"}
                  />
                  <text
                    alignmentBaseline="central"
                    x={linesLength}
                    y={maxRadius - 2 * minRadius}
                    fill="black"
                    stroke="none"
                  >
                    {laureatesMin}
                  </text>
                </g>
                <g>
                  <circle
                    cx={0}
                    cy={maxRadius - mediumRadius}
                    r={mediumRadius}
                  />
                  <line
                    x1={0}
                    y1={maxRadius - 2 * mediumRadius}
                    x2={linesLength}
                    y2={maxRadius - 2 * mediumRadius}
                    strokeDasharray={"6 4"}
                  />
                  <text
                    alignmentBaseline="central"
                    x={linesLength}
                    y={maxRadius - 2 * mediumRadius}
                    fill="black"
                    stroke="none"
                  >
                    {laureatesMedium}
                  </text>
                </g>
                <g>
                  <circle cx={0} cy={0} r={maxRadius} />
                  <line
                    x1={0}
                    y1={maxRadius - 2 * maxRadius}
                    x2={linesLength}
                    y2={maxRadius - 2 * maxRadius}
                    strokeDasharray={"6 4"}
                  />
                  <text
                    alignmentBaseline="central"
                    x={linesLength}
                    y={maxRadius - 2 * maxRadius}
                    fill="black"
                    stroke="none"
                  >
                    {laureatesMax}
                  </text>
                </g>
              </g>
            )}

            {/* contry legend */}
            {mode === "country" && (
              <g x={0} y={0}>
                <rect width={100} height={10} fill="url(#Gradient1)" />
                <text textAnchor="middle" y={-6}>
                  0
                </text>
                <text textAnchor="middle" x={100} y={-6}>
                  {laureatesMax}
                </text>
                <text textAnchor="start" x={0} y={-35}>
                  比例尺获奖人数对应颜色
                </text>
              </g>
            )}

            {/* 经纬度 */}
            <g fill="transparent" stroke="#09131b" strokeOpacity={0.2}>
              <path d={geoPathGenerator(graticuleGenerator())} />
              <path d={geoPathGenerator(graticuleGenerator.outline())} />
            </g>

            {/* 地图 */}
            <g className="map">
              {world.features.map((d, i) => {
                return (
                  <path
                    key={d.id + String(i)}
                    fill={
                      d.properties.laureates.length > 0
                        ? colorScale(d.properties.laureates.length)
                        : "#f8fcff"
                    }
                    stroke="#09131b"
                    strokeOpacity={0.4}
                    fillOpacity={mode === "country" ? 1 : 0}
                    d={geoPathGenerator(d)}
                    onMouseMove={(e) => {
                      if (mode !== "country") return;
                      const containerX = e.clientX;
                      const containerY = e.clientY;
                      showTooltip({
                        tooltipLeft: containerX,
                        tooltipTop: containerY,
                        tooltipData: `${d.properties.name}, ${d.properties.laureates.length} 获奖者`,
                      });
                    }}
                    onMouseLeave={() => {
                      if (mode !== "country") return;
                      hideTooltip();
                    }}
                  />
                );
              })}
              {mode === "city" &&
                city.map((d) => {
                  return (
                    <circle
                      key={d.city}
                      cx={projection([d.longitude, d.latitude])[0]}
                      cy={projection([d.longitude, d.latitude])[1]}
                      r={cityScale(d.laureates.length)}
                      fill={"#35a7c2"}
                      fillOpacity={0.5}
                      stroke={"#35a7c2"}
                      onMouseMove={(e) => {
                        if (mode !== "city") return;
                        const containerX = e.clientX;
                        const containerY = e.clientY;
                        showTooltip({
                          tooltipLeft: containerX,
                          tooltipTop: containerY,
                          tooltipData: `${d.city}, ${d.laureates.length} 获奖者`,
                        });
                      }}
                      onMouseLeave={() => {
                        if (mode !== "city") return;
                        hideTooltip();
                      }}
                    />
                  );
                })}
            </g>

            {/* tooltip */}
          </ChartContainer>
          {tooltipOpen && (
            <Tooltip left={tooltipLeft} top={tooltipTop}>
              {tooltipData}
            </Tooltip>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default WorldMap;
