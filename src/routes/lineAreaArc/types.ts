// date,max_temp_F,avg_temp_F,min_temp_F

export interface Data {
  date: Date;
  max_temp_F: number;
  avg_temp_F: number;
  min_temp_F: number;
}

export interface LineChartProps {
  data: Data[];
}
