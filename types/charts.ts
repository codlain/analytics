import { TopPagesData } from "@/types/top-pages";

export type ChartValue = number | string;

export interface ChartData {
  dates: string[];
  data: ChartValue[][];
}

export interface TopPagesChartData {
  data: TopPagesData[];
  columns: {
    label: string;
    value: keyof TopPagesData;
  }[];
  pages: string[];
  labels: number[];
}
