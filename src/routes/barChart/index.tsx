import React, { useEffect, useState } from "react";
import * as d3 from "d3";
import { Card, CardContent } from "@mui/material";
import BarChart from "./BarChart";

import type { DataList } from "./types";
import Post from "./post.mdx";
function BarChartRoot() {
  const [data, setData] = useState<DataList | null>(null);

  useEffect(() => {
    async function getData() {
      const data = (await d3.csv(
        "/data/alphabet.csv",
        d3.autoType
      )) as unknown as DataList;

      setData(data);
    }
    getData();
  }, []);

  return (
    <>
      <Card>
        <CardContent>{data ? <BarChart data={data} /> : "no data"}</CardContent>
      </Card>
      <Post />
    </>
  );
}

export default BarChartRoot;
