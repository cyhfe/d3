import React, { useEffect, useState } from "react";
import * as d3 from "d3";
import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import Chart from "./Chart";

import type { Data } from "./types";

import Post from "./post.mdx";

function ChartRoot() {
  const [data, setData] = useState<Data | null>(null);
  const [filter, setFilter] = useState<string>("usage");

  function getFilterColor(option: string) {
    return filter !== option ? "primary" : "secondary";
  }

  useEffect(() => {
    async function getData() {
      const data = (await d3.json("/data/stateofjs.json")) as unknown as Data;
      setData(data);
    }
    getData();
  }, []);

  return (
    <>
      <Typography variant="h4" gutterBottom>
        2022年前端框架排名
      </Typography>
      {data && (
        <>
          <Box mb={2}>
            <ButtonGroup size="small">
              <Button
                color={getFilterColor("usage")}
                onClick={() => setFilter("usage")}
              >
                usage
              </Button>
              <Button
                onClick={() => setFilter("awareness")}
                color={getFilterColor("awareness")}
              >
                awareness
              </Button>
              <Button
                onClick={() => setFilter("interest")}
                color={getFilterColor("interest")}
              >
                interest
              </Button>
              <Button
                onClick={() => setFilter("satisfaction")}
                color={getFilterColor("satisfaction")}
              >
                satisfaction
              </Button>
            </ButtonGroup>
          </Box>
          <Card>
            <CardContent>
              <Chart data={data} filter={filter} />
            </CardContent>
          </Card>
          <Post />
        </>
      )}
    </>
  );
}

export default ChartRoot;
