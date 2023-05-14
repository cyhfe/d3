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
  const height = 620;

  const projection = d3
    .geoEqualEarth()
    .translate([width / 2, height / 2])
    .scale(220);

  const geoPathGenerator = d3.geoPath().projection(projection);

  const graticuleGenerator = d3.geoGraticule();

  const colorScale = d3.scaleSequential(d3.interpolateYlGnBu).domain([1, 100]);
  const cityScale = d3
    .scaleRadial()
    .domain([0, d3.max(d3.map(city, (d) => d.laureates.length))])
    .range([0, 25]);

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
            css={css`
              outline: 1px solid red;
            `}
          >
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
                    // strokeOpacity={mode === "country" ? 0.4 : 0}
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
