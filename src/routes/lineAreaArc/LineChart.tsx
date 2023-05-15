import * as d3 from "d3";
import ChartContainer from "../../components/ChartContainer";
import { Data, LineChartProps } from "./types";
import { css } from "@emotion/react";

import locale from "d3-time-format/locale/zh-CN";
import { GradientOrangeRed } from "@visx/gradient";
import {
  animated,
  to,
  useChain,
  useSpring,
  useSpringRef,
  useTrail,
} from "@react-spring/web";
import { useEffect, useRef, useState } from "react";

d3.timeFormatDefaultLocale(locale as d3.TimeLocaleDefinition);

function LineChart({ data }: LineChartProps) {
  const width = 650;
  const height = 300;
  const margin = {
    top: 40,
    left: 40,
    right: 40,
    bottom: 40,
  };

  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const maxTems = d3.map(data, (d) => d.max_temp_F);

  const firstDate = new Date(2021, 0, 1, 0, 0, 0);
  const lastDate = d3.max(data, (d) => d.date);

  const xScale = d3
    .scaleTime()
    .domain([firstDate, lastDate])
    .range([0, innerWidth]);
  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(maxTems)])
    .range([innerHeight, 0]);

  const timeTicks = xScale.ticks();
  const formatMonth = d3.timeFormat("%b");

  const yTicks = yScale.ticks();

  const pathGenerator = d3
    .line<Data>()
    .x((d) => xScale(d.date))
    .y((d) => yScale(d.avg_temp_F))
    .curve(d3.curveCatmullRom);

  const areaGenerator = d3
    .area<Data>()
    .x0((d) => xScale(d.date))
    .x1((d) => xScale(d.date))
    .y0((d) => yScale(d.max_temp_F))
    .y1((d) => yScale(d.min_temp_F))
    .curve(d3.curveCatmullRom);

  const arcApi = useSpringRef();
  const arcTrail = useTrail(data.length, {
    ref: arcApi,
    from: {
      opacity: 0,
      scale: 0,
    },
    to: {
      opacity: 1,
      scale: 1,
    },
  });

  const pathRef = useRef<SVGPathElement | null>(null);
  const [t, setT] = useState(1);

  const pathApi = useSpringRef();
  const [pathStyle] = useSpring(
    () => ({
      ref: pathApi,
      from: {
        t: 0,
      },
      to: {
        t,
      },
      config: {
        duration: 3000,
      },
    }),
    [t]
  );

  // useChain([arcApi, pathApi], [0, 1], 1500);
  const lengthRef = useRef<number>(0);
  useEffect(() => {
    arcApi.start();
  }, [arcApi]);

  useEffect(() => {
    pathApi.start();
  }, [pathApi, t]);

  useEffect(() => {
    lengthRef.current = pathRef.current.getTotalLength();
  }, [t]);

  // useEffect(() => {
  //   const length = pathRef.current.getTotalLength();
  //   pathStyle.t.to((a) => {
  //     console.log(a, "1", t);
  //     const value = `${
  //       pathRef.current?.getTotalLength() * a
  //     },${pathRef.current?.getTotalLength()} `;
  //     d3.select(pathRef.current).attr("stroke-dasharray", value);
  //   });
  // }, [pathStyle.t, t]);

  return (
    <div>
      <input
        type="range"
        max={1}
        min={0}
        value={t}
        onChange={(e) => {
          console.log(e.target.value);
          setT(Number(e.target.value));
        }}
        step={0.1}
      />
      <div>
        <animated.div>{pathStyle.t.to((v) => v)}</animated.div>
        <div>{t}</div>
      </div>
      <ChartContainer
        viewWidth={width}
        viewHeight={height}
        margin={margin}
        css={css`
          max-width: 960px;
        `}
      >
        <GradientOrangeRed id="orange" />
        <g
          css={css`
            font-size: 8px;
            font-weight: lighter;
          `}
        >
          <g className="area">
            <animated.path
              // style={{
              //   x: pathStyle.t.to((a) => {
              //     console.log(a);
              //     return a * 10;
              //   }),
              // }}
              x={pathStyle.t.to((a) => {
                // console.log(a);
                return a * 10;
              })}
            >
              {pathStyle.t.to((a) => {
                // console.log(a);
                return a;
              })}
            </animated.path>

            <animated.path
              d={areaGenerator(data)}
              fillOpacity={1}
              fill="url(#orange)"
              stroke="none"
            />
          </g>
          <g className="path">
            <animated.path
              d={pathGenerator(data)}
              fill="none"
              stroke="white"
              ref={pathRef}
              strokeMiterlimit="1"
              strokeDasharray={pathStyle.t.to((a) => {
                const length = pathRef.current?.getTotalLength();
                if (!length) return "";
                return `${length * a} ${length}`;
              })}
            />
          </g>
          <g className="arc">
            {arcTrail.map((style, i) => {
              return (
                <animated.circle
                  style={{
                    transformOrigin: `${xScale(data[i].date)}px ${yScale(
                      data[i].avg_temp_F
                    )}px`,
                    ...style,
                  }}
                  key={data[i].date.toString()}
                  cx={xScale(data[i].date)}
                  cy={yScale(data[i].avg_temp_F)}
                  r={2}
                  fill="steelblue"
                />
              );
            })}
            {/* {data.map((d) => {
              return (
                <circle
                  key={d.date.toString()}
                  cx={xScale(d.date)}
                  cy={yScale(d.avg_temp_F)}
                  r={2}
                  fill="steelblue"
                />
              );
            })} */}
          </g>
          <g className="x-axis" transform={`translate(0, ${innerHeight})`}>
            <line x1={0} y1={0} x2={innerWidth} y2={0} stroke="steelblue" />
            {timeTicks.map((d) => {
              const currentMonth = d;
              const nextMonth = new Date(2021, currentMonth.getMonth() + 1, 1);
              const offset = (xScale(nextMonth) - xScale(currentMonth)) / 2;
              return (
                <g key={d.toString()}>
                  <text x={xScale(d) + offset} y={12} textAnchor="middle">
                    {formatMonth(d)}
                  </text>
                  <line
                    x1={xScale(d)}
                    y1={0}
                    x2={xScale(d)}
                    y2={4}
                    stroke="steelblue"
                  />
                </g>
              );
            })}
          </g>
          <g className="y-axis">
            <line x1={0} y1={0} x2={0} y2={innerHeight} stroke="steelblue" />
            {yTicks.map((d) => {
              return (
                <g key={d}>
                  <text
                    x={-10}
                    y={yScale(d)}
                    textAnchor="end"
                    alignmentBaseline="central"
                  >
                    {d}
                  </text>
                  <line
                    x1={0}
                    x2={-4}
                    y1={yScale(d)}
                    y2={yScale(d)}
                    stroke="steelblue"
                  />
                </g>
              );
            })}
          </g>
          <g className="label">
            <text textAnchor="middle" x={0} y={-25} alignmentBaseline="central">
              温度(°F)
            </text>
          </g>
          <g className="annotation">
            <g
              transform={`translate(${xScale(
                data[data.length - 4].date
              )}, ${yScale(data[data.length - 4].max_temp_F)})`}
            >
              <text x={20} y={-25} textAnchor="start">
                最高温度(日)
              </text>
              <line
                x1={5}
                y1={-5}
                x2={20}
                y2={-20}
                stroke="steelblue"
                strokeWidth={2}
              ></line>
            </g>
            <g
              transform={`translate(${xScale(
                data[data.length - 3].date
              )}, ${yScale(data[data.length - 3].min_temp_F)})`}
            >
              <text x={0} y={40} textAnchor="middle">
                最低温度(日)
              </text>
              <line
                x1={0}
                y1={5}
                x2={0}
                y2={25}
                stroke="steelblue"
                strokeWidth={2}
              ></line>
            </g>
          </g>
        </g>
      </ChartContainer>
    </div>
  );
}

export default LineChart;
