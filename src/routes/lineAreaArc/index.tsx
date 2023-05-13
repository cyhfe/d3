import * as d3 from "d3";
import React, { useEffect, useState } from "react";
import LineChart from "./LineChart";
import { Data } from "./types";
import { Card, CardContent } from "@mui/material";
import Code from "./code.mdx";
function LineAreaArc() {
  const [data, setData] = useState<Data[] | null>(null);
  useEffect(() => {
    async function getData() {
      const res = (await d3.csv(
        "./data/weekly_temperature.csv",
        d3.autoType
      )) as Data[];
      setData(res);
    }
    getData();
  }, []);

  return (
    <div>
      <Card>
        <CardContent>{data && <LineChart data={data} />}</CardContent>
      </Card>
      <Code />
    </div>
  );
}

export default LineAreaArc;
