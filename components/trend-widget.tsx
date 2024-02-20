"use client";

import { BarChart } from "@tremor/react";
import { Widget, WidgetContent, WidgetTitle } from "@/components/widget";
import { useMemo } from "react";
import moment from "moment";
import { Trend } from "@/types/trend";

interface TrendWidgetProps {
  data: Trend;
}

export default function TrendWidget({ data }: TrendWidgetProps) {
  const chartData = useMemo(
    () =>
      (data?.data ?? []).map((d) => ({
        Date: moment(d.t).format("HH:mm"),
        "Number of visits": d.visits,
      })),
    [data]
  );

  return (
    <Widget>
      <div className="flex items-center justify-between">
        <WidgetTitle>Users in last 30 minutes</WidgetTitle>
        <h3 className="text-red-500 font-normal text-xl">
          {data?.totalVisits ?? 0}
        </h3>
      </div>
      <WidgetContent loaderSize={40} noData={!chartData?.length}>
        <BarChart
          data={chartData}
          index="Date"
          categories={["Number of visits"]}
          colors={["primary"]}
          className="h-32"
          showXAxis={false}
          showYAxis={false}
          showLegend={false}
          showGridLines={false}
        />
      </WidgetContent>
    </Widget>
  );
}
