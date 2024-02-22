import { formatNumber } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageWithSearchParams } from "@/types";
import { getTopSources } from "@/lib/tinybird";
import { BarList } from "@/components/bar-list";

interface TopSourcesProps extends PageWithSearchParams {}

const TopSources = async ({ searchParams }: TopSourcesProps) => {
  const data = await getTopSources(
    searchParams?.date_from,
    searchParams?.date_to
  );

  const chartData = (data?.data ?? []).map((d) => ({
    name: d.referrer,
    value: d.visits,
    href: d.href,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Sources</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-5 gap-x-4 gap-y-2">
          <div className="col-span-4 text-xs font-semibold tracking-widest text-gray-500 uppercase h-5">
            Refs
          </div>
          <div className="col-span-1 font-semibold text-xs text-right tracking-widest uppercase h-5">
            Visitors
          </div>
          <div className="col-span-4">
            <BarList data={chartData} />
          </div>
          <div className="flex flex-col col-span-1 row-span-4 gap-2">
            {(data?.data ?? []).map(({ referrer, visits }) => (
              <div
                key={referrer}
                className="flex items-center justify-end w-full text-neutral-64 h-9"
              >
                {formatNumber(visits ?? 0)}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TopSources;
