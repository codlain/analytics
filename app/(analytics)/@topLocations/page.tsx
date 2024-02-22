import { getTopLocations } from "@/lib/tinybird";
import { PageWithSearchParams, TopPagesSorting } from "@/types";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { BarList } from "@/components/bar-list";

interface TopLocationsProps extends PageWithSearchParams {}

const TopLocations = async ({ searchParams }: TopLocationsProps) => {
  const sorting = (searchParams?.top_pages_sorting ||
    TopPagesSorting.Visitors) as TopPagesSorting;

  const { data } = await getTopLocations(
    sorting,
    searchParams?.date_from,
    searchParams?.date_to
  );

  const chartData = (data ?? []).map((d) => ({
    name: d.location,
    value: d[sorting],
  }));

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
              "col-span-1 font-semibold text-xs text-right tracking-widest uppercase cursor-pointer h-5",
              sorting === TopPagesSorting.Pageviews && "text-primary"
            )}
          >
            Pageviews
          </Link>

          <div className="col-span-3">
            <BarList data={chartData} />
          </div>
          <div className="flex flex-col col-span-1 row-span-4 gap-2">
            {(data ?? []).map(({ location, visits }) => (
              <div
                key={location}
                className="flex items-center justify-end w-full text-neutral-64 h-9"
              >
                {visits}
              </div>
            ))}
          </div>
          <div className="flex flex-col col-span-1 row-span-4 gap-2">
            {(data ?? []).map(({ location, hits }) => (
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

export default TopLocations;
