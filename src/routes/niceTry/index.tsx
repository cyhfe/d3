import { Box, Card, CardContent, Stack, Typography, css } from "@mui/material";
import ChartContainer from "../../components/ChartContainer";
import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";

function generateNonDuplicateArray(count: number) {
  const array = [];
  for (let i = 0; i < 10; i++) {
    array.push(i);
  }

  const result = [];
  for (let i = 0; i < count; i++) {
    const index = Math.floor(Math.random() * array.length);
    result.push(array[index]);
    array.splice(index, 1);
  }

  return result;
}

function BarChartRace() {
  const innerChartRef = useRef<SVGGElement | null>(null);

  const [dataset, setDataset] = useState<number[] | null>(null);

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
    const d = generateNonDuplicateArray(10);
    console.log(d);
    setDataset(d);
  }, []);

  useEffect(() => {
    async function draw() {
      console.log("draw");

      if (!innerChartRef.current || !dataset) return;
      if (!dataset) return;

      const innerChart = innerChartRef.current;
      const bars = d3.select(innerChart).selectAll("rect");

      bars
        .data(dataset, (d) => d)
        .join(
          (enter) => enter.append("rect"),
          (update) => update,
          (exit) => exit
        )
        .call((bars) => console.log(bars));
    }
    draw();
  }, [dataset, innerHeight, innerWidth]);

  return (
    <Box className="bar-chart-race">
      <Typography variant="h4" gutterBottom>
        BarChart Race
      </Typography>
      <button
        onClick={() => {
          const d = generateNonDuplicateArray(10);
          console.log(d);
          setDataset(d);
        }}
      >
        +
      </button>
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
              <g className="inner-chart" ref={innerChartRef}></g>
            </ChartContainer>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}

export default BarChartRace;
