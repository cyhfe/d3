import * as d3 from "d3";
import { useMemo } from "react";

const width = 600;
const height = 300;

const KEYS = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const OCTAVE = [1, 2, 3, 4, 5, 6, 7];

function getKeysWidthOctave() {
  const output = [];
  for (const o of OCTAVE) {
    for (const k of KEYS) {
      output.push(k + o);
    }
  }
  return output;
}

function useScale() {
  const keys = getKeysWidthOctave();
  const xScale = d3.scaleBand().domain(keys).range([0, 600]).padding(0.2);
  const yScale = d3.scaleLinear().range([0, 300]);

  return {
    xScale,
    yScale,
  };
}

export { useScale };
