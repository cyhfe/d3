import * as d3 from "d3";
export const languageFamilies = [
  { label: "Indo-European", color: "#4E86A5" },
  { label: "Sino-Tibetan", color: "#9E4E9E" },
  { label: "Afro-Asiatic", color: "#59C8DC" },
  { label: "Austronesian", color: "#3E527B" },
  { label: "Japanic", color: "#F99E23" },
  { label: "Niger-Congo", color: "#F36F5E" },
  { label: "Dravidian", color: "#C33D54" },
  { label: "Turkic", color: "#D57AB1" },
  { label: "Koreanic", color: "#33936F" },
  { label: "Kra-Dai", color: "#36311F" },
  { label: "Uralic", color: "#B59930" },
];

export const colorScale: (label: string) => string = d3
  .scaleOrdinal<string>()
  .domain(languageFamilies.map((d) => d.label))
  .range(languageFamilies.map((d) => d.color));

export const getRadius = (maxSpeakers, speakers) => {
  const radialScale = d3.scaleRadial().domain([0, maxSpeakers]).range([0, 83]);

  return radialScale(speakers);
};
