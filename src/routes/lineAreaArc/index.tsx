import * as d3 from "d3";
import React, { useEffect, useState } from "react";
import LineChart from "./LineChart";
import { Data } from "./types";

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

  useEffect(() => {
    console.log(data);
  }, [data]);

  return <div>{data && <LineChart data={data} />}</div>;
}

export default LineAreaArc;
