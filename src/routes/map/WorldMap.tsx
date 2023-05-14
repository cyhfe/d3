import { useEffect, useMemo, useState } from "react";
import { WorldMapProps, Laureates } from "./types";
import ChartContainer from "../../components/ChartContainer";
import { css } from "@emotion/react";
import * as d3 from "d3";
import { Button, ButtonGroup, Card, CardContent } from "@mui/material";
import { Tooltip, useTooltip } from "@visx/tooltip";

function WorldMap({ world, laureates, city }: WorldMapProps) {
  const [mode, setMode] = useState<"city" | "country">("country");
  const width = 1230;
  const height = 720;

  const margin = {
    left: 30,
    bottom: 30,
    top: 80,
    right: 30,
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
          <ButtonGroup>
            <Button
              onClick={() => setMode("country")}
              color={mode === "city" ? "primary" : "secondary"}
            >
              按国家
            </Button>
            <Button
              onClick={() => setMode("city")}
              color={mode === "country" ? "primary" : "secondary"}
            >
              按城市
            </Button>
          </ButtonGroup>
          <ChartContainer
            viewHeight={height}
            viewWidth={width}
            margin={margin}
            css={css`
              outline: 1px solid red;
            `}
          >
            {/* city legend */}
            {mode === "city" && (
              <g fill={"transparent"} stroke={"#09131b"}>
                <text x={-maxRadius} y={-50} fill={"#09131b"} stroke="none">
                  比例尺: 半径-人数
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
