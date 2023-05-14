import { useEffect, useMemo } from "react";
import { WorldMapProps, Laureates } from "./types";
import ChartContainer from "../../components/ChartContainer";
import { css } from "@emotion/react";
import * as d3 from "d3";
import { Card, CardContent } from "@mui/material";
import { Tooltip, useTooltip } from "@visx/tooltip";
import useThrottle from "../../utils/useThrottle";

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

  const handleMove = useThrottle((e, d) => {
    const containerX = e.clientX;
    const containerY = e.clientY;
    showTooltip({
      tooltipLeft: containerX,
      tooltipTop: containerY,
      tooltipData: `${d.properties.name}, ${d.properties.laureates.length} 获奖者`,
    });
  }, 10);

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
                    d={geoPathGenerator(d)}
                    onMouseMove={(e) => handleMove(e, d)}
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
