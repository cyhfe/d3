import { useEffect } from "react";
import { WorldJSON, WorldMapProps } from "./types";
import ChartContainer from "../../components/ChartContainer";
import { css } from "@emotion/react";
import * as d3 from "d3";

function WorldMap({ data }: WorldMapProps) {
  const width = 1230;
  const height = 620;

  const projection = d3
    .geoEqualEarth()
    .translate([width / 2, height / 2])
    .scale(220);

  const geoPathGenerator = d3.geoPath().projection(projection);

  const graticuleGenerator = d3.geoGraticule();

  useEffect(() => {
    console.log(data);
  }, [data]);
  return (
    <div>
      <ChartContainer
        viewHeight={height}
        viewWidth={width}
        css={css`
          outline: 1px solid red;
        `}
      >
        {data.features.map((d, i) => {
          return (
            <path
              key={d.id + String(i)}
              fill="#f8fcff"
              stroke="#09131b"
              strokeOpacity={0.4}
              d={geoPathGenerator(d)}
            />
          );
        })}
      </ChartContainer>
    </div>
  );
}

export default WorldMap;
