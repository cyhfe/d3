import React, { useEffect, useState } from "react";
import * as d3 from "d3";
import { Card, CardContent, Typography } from "@mui/material";
import AreaChart from "./AreaChart";

import type { DataList } from "./types";
import Post from "./post.mdx";
function AreaChartRoot() {
  const [data, setData] = useState<DataList | null>(null);

  useEffect(() => {
    async function getData() {
      const data = (await d3.csv(
        "/data/aapl.csv",
        d3.autoType
      )) as unknown as DataList;

      setData(data);
    }
    getData();
  }, []);

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Apple股票每日收盘价
      </Typography>
      {data && (
        <>
          <Card>
            <CardContent>
              <AreaChart data={data} />
            </CardContent>
          </Card>
          <Post />
        </>
      )}
    </>
  );
}

export default AreaChartRoot;
