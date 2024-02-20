"use client";

import { BarList } from "@tremor/react";
import { TopLocations, TopLocationsSorting } from "@/types/top-locations";
import { cn } from "@/lib/utils";
import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import useSortingParams from "@/hooks/use-sorting-params";

interface TopLocationsWidgetProps {
  data: TopLocations;
}

export const TopLocationsWidget = ({ data }: TopLocationsWidgetProps) => {
  const [sorting, setSorting] = useSortingParams({
    key: "top_locations_sorting",
    values: Object.values(TopLocationsSorting),
  });

  const chartData = useMemo(
    () =>
      (data?.data ?? []).map((d) => ({
        name: d.location,
        value: d[sorting],
      })),
    [data?.data, sorting]
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Countries</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-5 gap-x-4 gap-y-2">
          <div className="col-span-3 text-xs font-semibold tracking-widest text-gray-500 uppercase h-5">
            Country
          </div>
          <div
            className={cn(
              "col-span-1 font-semibold text-xs text-right tracking-widest uppercase cursor-pointer h-5",
              sorting === TopLocationsSorting.Visitors && "text-primary"
            )}
            onClick={() => setSorting(TopLocationsSorting.Visitors)}
          >
            Visits
          </div>
          <div
            className={cn(
              "col-span-1 font-semibold text-xs text-right tracking-widest uppercase cursor-pointer h-5",
              sorting === TopLocationsSorting.Pageviews && "text-primary"
            )}
            onClick={() => setSorting(TopLocationsSorting.Pageviews)}
          >
            Pageviews
          </div>

          <div className="col-span-3">
            <BarList data={chartData} valueFormatter={() => ""} />
          </div>
          <div className="flex flex-col col-span-1 row-span-4 gap-2">
            {(data?.data ?? []).map(({ location, visits }) => (
              <div
                key={location}
                className="flex items-center justify-end w-full text-neutral-64 h-9"
              >
                {visits}
              </div>
            ))}
          </div>
          <div className="flex flex-col col-span-1 row-span-4 gap-2">
            {(data?.data ?? []).map(({ location, hits }) => (
              <div
                key={location}
                className="flex items-center justify-end w-full text-neutral-64 h-9"
              >
                {hits}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
