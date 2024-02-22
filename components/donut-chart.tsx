"use client";

import { formatNumber } from "@/lib/utils";
import { tremorPieChartColors } from "@/styles/tremor-colors";
import { DonutChart as TremorDonutChart } from "@tremor/react";

interface DonutChartProps {
  index: string;
  data: {
    [key: string]: string | number;
  }[];
}

export const DonutChart = ({ index, data }: DonutChartProps) => {
  return (
    <TremorDonutChart
      variant="pie"
      data={data}
      category="visits"
      index={index}
      colors={tremorPieChartColors.map(([color]) => color)}
      showLabel={false}
      valueFormatter={formatNumber}
    />
  );
};
