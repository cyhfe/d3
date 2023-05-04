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

interface Rank {
  rank: number;
  name: string;
  value: number;
}

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
    const names = new Set(dataset.map((d) => d.name));
    // console.log(dataset);

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

    const datevalues: [Date, d3.InternMap<string, number>][] = Array.from(
      d3.rollup(
        dataset,
        ([d]) => d.value,
        (d) => +d.date,
        (d) => d.name
      )
    ).map(([date, data]) => {
      return [new Date(date), data];
    });

    datevalues.sort(([d1], [d2]) => d3.ascending(d1, d2));

    // datevalues
    // [
    //   [date, Map(name => value ...)]
    //   ...
    // ]

    function rank(getValueByName: (name: string) => number): Rank[] {
      const data = Array.from(names, (name) => ({
        name,
        value: getValueByName(name),
      }));
      data.sort((a, b) => d3.descending(a.value, b.value));
      const dataWithRank = data.map((d, i) => ({ ...d, rank: i }));
      return dataWithRank;
    }

    // 我们需要时间对应排名的 date => rank[]
    // 由于排名每年变化一次,20 年才生成 20 个过渡动画,所以我们要对每两年的数据进行线性插值(k代表插值数)
    function getKeyframes(): [Date, ReturnType<typeof rank>][] {
      const k = 10;
      const keyframes: [Date, ReturnType<typeof rank>][] = [];
      for (const pairs of d3.pairs(datevalues)) {
        const [[ka, a], [kb, b]] = pairs;
        for (let i = 0; i < k; i++) {
          const t = i / k;

          keyframes.push([
            new Date((+kb - +ka) * t + +ka),
            rank(
              (name) =>
                ((b.get(name) || 0) - (a.get(name) || 0)) * t +
                (a.get(name) || 0)
            ),
          ]);
        }
      }
      const lastValue = datevalues[datevalues.length - 1];
      keyframes.push([
        new Date(lastValue[0]),
        rank((name) => lastValue[1].get(name) || 0),
      ]);

      return keyframes;
    }
    const keyframes = getKeyframes();
    console.log(keyframes.slice(0, 10));

    // enter => .attr("y", d => y((prev.get(d) || d).rank))
    //          .attr("width", d => x((prev.get(d) || d).value) - x(0)),

    // exit => exit.transition(transition).remove()
    // .attr("y", d => y((next.get(d) || d).rank))
    // .attr("width", d => x((next.get(d) || d).value) - x(0))

    // 过渡效果:
    // 进入时,移动到前一个时间点的位置
    // 退出时,移动到下一个时间点的位置
    // 进入和更新合并更新当前位置
    const flatKeyframesWithoutDate = keyframes.map(([, data]) => data).flat();

    // 得到 name => rank[](按时间排序)
    const nameFrames = d3.group(flatKeyframesWithoutDate, (v) => v.name);

    //   [string, {
    //     rank: number;
    //     name: string;
    //     value: number;
    //   }[]][]

    const nameFramesArray = Array.from(nameFrames);

    // [
    //   [
    //     // 按名字排序
    //     [
    //       // 按时间排序
    //       Rank1,
    //       Rank2
    //     ],
    //   ],
    //   ...
    // ]
    const mapNameFramesArray = nameFramesArray.map(([, data]) => {
      // [
      //   // 按名字排序
      //   [
      //     // 按时间排序
      //     Rank1,
      //     Rank2
      //   ],
      // ]
      const pairs = d3.pairs(data, (a, b) => [b, a]) as [Rank, Rank][];
      return pairs;
    });

    // [
    //   [ Rank1,Rank2,]
    //   [ Rank1,Rank2,]
    //   [ Rank1,Rank2,]
    // ]
    const flatMapNameFramesArray = mapNameFramesArray.flat();

    const prev = new Map(flatMapNameFramesArray);
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
