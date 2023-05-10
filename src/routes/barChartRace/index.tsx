import { Box, Button, Card, CardContent, Typography, css } from "@mui/material";
import ChartContainer from "../../components/ChartContainer";
import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";
import useChart from "./useChart";
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

  const viewWidth = 600;
  const viewHeight = 300;

  const margin = {
    top: 26,
    bottom: 6,
    left: 6,
    right: 6,
  };

  const innerHeight = viewHeight - margin.top - margin.bottom;
  const innerWidth = viewWidth - margin.left - margin.right;

  const { updateChart } = useChart(
    dataset,
    innerChartRef,
    innerHeight,
    innerWidth
  );

  function handleReplay() {
    updateChart();
  }

  useEffect(() => {
    updateChart();
  }, [dataset, updateChart]);

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

  return (
    <Box className="bar-chart-race">
      <Typography variant="h4" gutterBottom>
        趋势图动态排序
      </Typography>
      <Box>
        <Button variant="outlined" onClick={() => handleReplay()}>
          重新播放
        </Button>
      </Box>
      <Box mt={2}>
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
