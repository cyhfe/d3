import { useEffect, useMemo, useState } from "react";
import { WorldMapProps, Laureates } from "./types";
import ChartContainer from "../../components/ChartContainer";
import { css } from "@emotion/react";
import * as d3 from "d3";
import { Button, ButtonGroup, Card, CardContent } from "@mui/material";
import { Tooltip, useTooltip } from "@visx/tooltip";

function WorldMap({ world, laureates }: WorldMapProps) {
  const [mode, setMode] = useState<"city" | "country">("country");
  const width = 1230;
  const height = 620;

  const projection = d3
    .geoEqualEarth()
    .translate([width / 2, height / 2])
    .scale(220);

  const geoPathGenerator = d3.geoPath().projection(projection);

  const graticuleGenerator = d3.geoGraticule();

  const cities = [];
  laureates.forEach((laureate) => {
    if (laureate.birth_country !== "" && laureate.birth_city !== "") {
      const relatedCity =
        cities.find((city) => city.city === laureate.birth_city) &&
        cities.find((city) => city.country === laureate.birth_country);

      if (relatedCity) {
        relatedCity.laureates.push(laureate);
      } else {
        cities.push({
          city: laureate.birth_city,
          country: laureate.birth_country,
          latitude: laureate.birt_city_latitude,
          longitude: laureate.birt_city_longitude,
          laureates: [laureate],
        });
      }
    }
  });

  const colorScale = d3.scaleSequential(d3.interpolateYlGnBu).domain([1, 100]);
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
                      const containerX = e.clientX;
                      const containerY = e.clientY;
                      showTooltip({
                        tooltipLeft: containerX,
                        tooltipTop: containerY,
                        tooltipData: `${d.properties.name}, ${d.properties.laureates.length} 获奖者`,
                      });
                    }}
                    onMouseLeave={() => {
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
