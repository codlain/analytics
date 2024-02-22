"use client";

import { KPI_OPTIONS, KpiType } from "@/types/kpis";
import { AreaChart as TremorAreaChart } from "@tremor/react";

interface AreaChartProps {
  data: {
    [x: string]: string | number;
    date: string;
  }[];
  kpi: KpiType;
}

export const AreaChart = ({ data, kpi }: AreaChartProps) => {
  const kpiOption = KPI_OPTIONS.find(({ value }) => value === kpi)!;

  return (
    <TremorAreaChart
      className="mt-4 h-72"
      data={data}
      index="date"
      categories={[kpiOption.label]}
      colors={["blue"]}
      yAxisWidth={30}
      valueFormatter={kpiOption.formatter}
      showLegend={false}
      showGradient={false}
    />
  );
};
