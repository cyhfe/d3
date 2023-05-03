import { Box, Card, CardContent, Stack, Typography, css } from "@mui/material";
import ChartContainer from "../../components/ChartContainer";
import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";

interface Data {
  date: Date;
  name: string;
  category: string;
  value: number;
}

type Dataset = Data[];

function BarChartRace() {
  const innerChartRef = useRef<SVGGElement | null>(null);

  const [dataset, setDataset] = useState<Dataset | null>(null);

  const viewWidth = 400;
  const viewHeight = 200;

  const margin = {
    top: 16,
    bottom: 6,
    left: 6,
    right: 6,
  };

  const innerHeight = viewHeight - margin.top - margin.bottom;
  const innerWidth = viewWidth - margin.left - margin.right;

  useEffect(() => {
    async function getDataset() {
      const dataset = (await d3.csv(
        "data/category-brands.csv",
        d3.autoType
      )) as Dataset;
      setDataset(dataset);
    }
    getDataset();
  }, []);

  useEffect(() => {
    if (!dataset) return;
    const data = d3.group(dataset, (d) => d.name);
    const names = new Set(dataset.map((d) => d.name));
    console.log(dataset);

    // rollup返回嵌套的map
    // {
    //   date => {
    //     name => value
    //     ...
    //   }
    //   ...
    // }

    // 转化为数组
    //
    // [
    //   [ date, name => value ],
    //   ...
    // ]

    const datevalues = Array.from(
      d3.rollup(
        dataset,
        ([d]) => d.value,
        (d) => +d.date,
        (d) => d.name
      )
    )
      .map(([date, data]) => {
        return [new Date(date), data];
      })
      .sort(([d1], [d2]) => d3.ascending(d1 as Date, d2 as Date));

    console.log(datevalues);
  }, [dataset]);

  return (
    <Box className="bar-chart-race">
      <Typography variant="h4" gutterBottom>
        BarChart Race
      </Typography>
      <Box>
        <Card>
          <CardContent
            css={css`
              display: flex;
              justify-content: center;
              align-items: center;
            `}
          >
            <ChartContainer
              viewWidth={viewWidth}
              viewHeight={viewHeight}
              margin={margin}
              css={css`
                outline: 1px solid red;
              `}
            >
              <g className="inner-chart" ref={innerChartRef}>
                <rect
                  width={innerWidth}
                  height={innerHeight}
                  stroke="black"
                  fill="none"
                />
              </g>
            </ChartContainer>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}

export default BarChartRace;
