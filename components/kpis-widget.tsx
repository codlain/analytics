"use client";

import { Widget, WidgetContent, WidgetTitle } from "@/components/widget";
import { KpisTabs } from "@/components/kpis-tabs";
import useKpis from "@/hooks/use-kpis";
import { AreaChart } from "@tremor/react";
import { useMemo } from "react";
import { ChartData } from "@/types/charts";
import { KpiTotals } from "@/types/kpis";
import NewAreaChart from "@/components/new-area-chart";

interface KpisWidgetProps {
  kpiTotalsData: KpiTotals;
  kpisData: ChartData;
}

export const KpisWidget = ({ kpisData, kpiTotalsData }: KpisWidgetProps) => {
  const { kpi, setKpi, kpiOption } = useKpis();

  const chartData = useMemo(
    () =>
      (kpisData?.dates ?? []).map((date, index) => {
        const value = Math.max(
          Number(kpisData?.data[0][index]) || 0,
          Number(kpisData?.data[1][index]) || 0
        );

        return {
          date: date.toUpperCase(),
          [kpiOption.label]: value,
        };
      }),
    [kpisData?.data, kpisData?.dates, kpiOption]
  );

  return (
    <Widget>
      <WidgetTitle isVisuallyHidden>KPIs</WidgetTitle>
      <KpisTabs value={kpi} onChange={setKpi} totals={kpiTotalsData} />
      <WidgetContent noData={!chartData?.length} className="pt-2 mt-4">
        <AreaChart
          className="mt-4 h-72"
          data={chartData}
          index="date"
          categories={[kpiOption.label]}
          colors={["#0761d1"]}
          yAxisWidth={30}
          valueFormatter={kpiOption.formatter}
          showLegend={false}
          showGradient={false}
        />
        {/* <NewAreaChart /> */}
      </WidgetContent>
    </Widget>
  );
};
