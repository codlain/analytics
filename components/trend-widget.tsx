"use client";

import { BarChart } from "@tremor/react";
import { useMemo } from "react";
import moment from "moment";
import { Trend } from "@/types/trend";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

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
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Users in last 30 minutes</CardTitle>
          <h3 className="text-foreground font-normal text-xl">
            {data?.totalVisits ?? 0}
          </h3>
        </div>
      </CardHeader>
      <CardContent>
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
      </CardContent>
    </Card>
  );
}
