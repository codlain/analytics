import React from "react";
import { cn, formatNumber } from "@/lib/utils";
import { TopPagesSorting } from "@/types/top-pages";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageWithSearchParams } from "@/types";
import { getDomain, getTopPages } from "@/lib/tinybird";
import Link from "next/link";
import { BarList } from "@/components/bar-list";

interface TopPagesProps extends PageWithSearchParams {}

const TopPages = async ({ searchParams }: TopPagesProps) => {
  const sorting = searchParams?.top_pages_sorting as TopPagesSorting;

  const { data } = await getTopPages(
    sorting,
    searchParams?.date_from,
    searchParams?.date_to
  );

  const chartData = (data ?? []).map((d) => ({
    name: d.pathname,
    value: d[sorting],
  }));

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
          <Link
            href={{
              query: {
                ...searchParams,
                top_pages_sorting: TopPagesSorting.Visitors,
              },
            }}
            scroll={false}
            className={cn(
              "col-span-1 font-semibold text-xs text-right tracking-widest uppercase cursor-pointer h-5",
              sorting === TopPagesSorting.Visitors && "text-primary"
            )}
          >
            Visits
          </Link>
          <Link
            href={{
              query: {
                ...searchParams,
                top_pages_sorting: TopPagesSorting.Pageviews,
              },
            }}
            scroll={false}
            className={cn(
              "col-span-1 row-span-1 font-semibold text-xs text-right tracking-widest uppercase cursor-pointer h-5",
              sorting === TopPagesSorting.Pageviews && "text-primary"
            )}
          >
            Pageviews
          </Link>

          <div className="col-span-3">
            <BarList data={chartData} />
          </div>
          <div className="flex flex-col col-span-1 row-span-4 gap-2">
            {(data ?? []).map(({ pathname, visits }) => (
              <div
                key={pathname}
                className="flex items-center justify-end w-full text-foreground h-9"
              >
                {formatNumber(visits ?? 0)}
              </div>
            ))}
          </div>
          <div className="flex flex-col col-span-1 row-span-4 gap-2">
            {(data ?? []).map(({ pathname, hits }) => (
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

export default TopPages;
