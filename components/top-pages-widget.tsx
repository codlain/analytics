"use client";

import { Widget, WidgetContent, WidgetTitle } from "@/components/widget";
import { BarList } from "@tremor/react";
import { useMemo } from "react";
import { cn, formatNumber } from "@/lib/utils";
import { TopPagesSorting } from "@/types/top-pages";
import { TopPagesChartData } from "@/types/charts";
import { DomainData } from "@/types/domain";
import useSortingParams from "@/hooks/use-sorting-params";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface TopPagesWidgetProps {
  domainData: DomainData;
  data: TopPagesChartData;
}

export const TopPagesWidget = ({ domainData, data }: TopPagesWidgetProps) => {
  const [sorting, setSorting] = useSortingParams({
    key: "top_pages_sorting",
    values: Object.values(TopPagesSorting),
  });

  const chartData = useMemo(
    () =>
      (data?.data ?? []).map((d) => ({
        name: d.pathname,
        value: d[sorting],
      })),
    [data?.data, domainData.domain, sorting]
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Pages</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-5 gap-x-4 gap-y-2">
          <div className="col-span-3 text-xs font-semibold tracking-widest text-gray-500 uppercase h-5">
            Content
          </div>
          <div
            className={cn(
              "col-span-1 font-semibold text-xs text-right tracking-widest uppercase cursor-pointer h-5",
              sorting === TopPagesSorting.Visitors && "text-primary"
            )}
            onClick={() => setSorting(TopPagesSorting.Visitors)}
          >
            Visits
          </div>
          <div
            className={cn(
              "col-span-1 row-span-1 font-semibold text-xs text-right tracking-widest uppercase cursor-pointer h-5",
              sorting === TopPagesSorting.Pageviews && "text-primary"
            )}
            onClick={() => setSorting(TopPagesSorting.Pageviews)}
          >
            Pageviews
          </div>

          <div className="col-span-3">
            <BarList data={chartData} valueFormatter={() => ""} />
          </div>
          <div className="flex flex-col col-span-1 row-span-4 gap-2">
            {(data?.data ?? []).map(({ pathname, visits }) => (
              <div
                key={pathname}
                className="flex items-center justify-end w-full text-foreground h-9"
              >
                {formatNumber(visits ?? 0)}
              </div>
            ))}
          </div>
          <div className="flex flex-col col-span-1 row-span-4 gap-2">
            {(data?.data ?? []).map(({ pathname, hits }) => (
              <div
                key={pathname}
                className="flex items-center justify-end w-full text-foreground h-9"
              >
                {formatNumber(hits)}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
