import "normalize.css";

import Chart from "./components/Chart";
import { css } from "@emotion/react";
import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
function generateNonDuplicateArray(count: number) {
  const array = [];
  for (let i = 0; i < 100; i++) {
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

function App() {
  const [data, setData] = useState(() => generateNonDuplicateArray(20));
  const dataRef = useRef(data);

  const [isSorting, setIsSorting] = useState(false);
  const [startSorting, setStartSorting] = useState(false);

  useEffect(() => {
    if (!startSorting) return;
    async function bubbleSort() {
      const arr = [...data];
      const len = arr.length;

      // 冒泡排序算法
      for (let i = 0; i < len - 1; i++) {
        for (let j = 0; j < len - i - 1; j++) {
          if (arr[j] > arr[j + 1]) {
            const tmp = arr[j];
            arr[j] = arr[j + 1];
            arr[j + 1] = tmp;
            console.log(isSorting, startSorting);

            await sleep(500);
            setData((prev) => {
              // 使用函数式更新
              const next = [...prev];
              [next[j], next[j + 1]] = [next[j + 1], next[j]];
              return next;
            });
          }
        }
      }
      setStartSorting(false);
      setIsSorting(false);
    }
    if (startSorting && !isSorting) {
      setIsSorting(true);
      bubbleSort();
    }
  }, [data, isSorting, startSorting]);

  async function sleep(delay: number) {
    return new Promise((resolve) => setTimeout(resolve, delay));
  }

  function handleSort() {
    setStartSorting((b) => !b);
  }

  function handleShuffle() {
    setIsSorting(false);
    setStartSorting(false);

    const next = d3.shuffle([...data]);
    setData(next);
  }
  function handleGenRandom() {
    setIsSorting(false);
    setStartSorting(false);
    const next = generateNonDuplicateArray(20);
    setData(next);
  }

  return (
    <div
      className="sort-viz"
      css={css`
        margin-left: auto;
        margin-right: auto;
        max-width: 1200px;
      `}
    >
      <h2>Chart</h2>
      <div>
        <button onClick={handleSort}>sort</button>
        <button onClick={handleShuffle}>suffle</button>
        <button onClick={handleGenRandom}>random</button>
      </div>
      <div>isSorting: {isSorting + ""}</div>
      <div>startSorting: {startSorting + ""}</div>
      <Chart data={data} />
    </div>
  );
}

export default App;
