import { useEffect, useMemo } from "react";
import { WorldMapProps, Laureates } from "./types";
import ChartContainer from "../../components/ChartContainer";
import { css } from "@emotion/react";
import * as d3 from "d3";
import { Card, CardContent } from "@mui/material";

function WorldMap({ world, laureates }: WorldMapProps) {
  const width = 1230;
  const height = 620;

  const projection = d3
    .geoEqualEarth()
    .translate([width / 2, height / 2])
    .scale(220);

  const geoPathGenerator = d3.geoPath().projection(projection);

  const graticuleGenerator = d3.geoGraticule();

  const colorScale = d3.scaleSequential(d3.interpolateGnBu).domain([1, 100]);

  return (
    <div>
      <Card>
        <CardContent>
          <ChartContainer
            viewHeight={height}
            viewWidth={width}
            css={css`
              outline: 1px solid red;
            `}
          >
            {/* 地图 */}
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
                  d={geoPathGenerator(d)}
                />
              );
            })}

            {/* 经纬度 */}
            <g fill="transparent" stroke="#09131b" strokeOpacity={0.2}>
              <path d={geoPathGenerator(graticuleGenerator())} />
              <path d={geoPathGenerator(graticuleGenerator.outline())} />
            </g>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}

export default WorldMap;
