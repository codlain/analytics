import { Fragment } from "react";
import { formatNumber } from "@/lib/utils";
import { tremorPieChartColors } from "@/styles/tremor-colors";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageWithSearchParams } from "@/types";
import { getTopBrowsers } from "@/lib/tinybird";
import { DonutChart } from "@/components/donut-chart";

interface TopBrowsersProps extends PageWithSearchParams {}

const TopBrowsers = async ({ searchParams }: TopBrowsersProps) => {
  const { data } = await getTopBrowsers(
    searchParams?.date_from,
    searchParams?.date_to
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Browsers</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full h-full grid grid-cols-2">
          <DonutChart index="browser" data={data || []} />
          <div className="justify-self-end">
            <div className="grid gap-y-1 gap-4 grid-cols-2">
              <div className="text-xs tracking-widest font-medium uppercase text-center truncate">
                Browser
              </div>
              <div className="text-xs tracking-widest font-medium uppercase text-right truncate">
                Visitors
              </div>
              {(data ?? []).map(({ browser, visits }, index) => (
                <Fragment key={browser}>
                  <div className="flex items-center gap-2 text-sm leading-5 text-neutral-64 h-9 px-4 py-2 rounded-md z-10">
                    <div
                      className="h-4 min-w-[1rem]"
                      style={{
                        backgroundColor: tremorPieChartColors[index][1],
                      }}
                    />
                    <span>{browser}</span>
                  </div>
                  <div className="flex items-center justify-end text-neutral-64 h-9">
                    {formatNumber(visits)}
                  </div>
                </Fragment>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TopBrowsers;
