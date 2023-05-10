import React, { useEffect, useState } from "react";
import * as d3 from "d3";
import { Card, CardContent, Typography } from "@mui/material";
import Chart from "./Chart";

import type { DataList } from "./types";
import Post from "./post.mdx";
function ChartRoot() {
  const [data, setData] = useState<DataList | null>(null);

  useEffect(() => {
    async function getData() {
      const data = (await d3.json(
        "/data/stateofjs.json"
      )) as unknown as DataList;
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
          <Card>
            <CardContent>
              <Chart data={data} />
            </CardContent>
          </Card>
          <Post />
        </>
      )}
    </>
  );
}

export default ChartRoot;
