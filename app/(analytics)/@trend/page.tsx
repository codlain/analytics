import { BarChart } from "@tremor/react";
import moment from "moment";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getTrend } from "@/lib/tinybird";
import { PageWithSearchParams } from "@/types";

interface TrendProps extends PageWithSearchParams {}

const Trend = async ({ searchParams }: TrendProps) => {
  const { data, totalVisits } = await getTrend(
    searchParams?.date_from,
    searchParams?.date_to
  );

  const chartData = (data ?? []).map((d) => ({
    Date: moment(d.t).format("HH:mm"),
    "Number of visits": d.visits,
  }));

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Users in last 30 minutes</CardTitle>
          <h3 className="text-foreground font-normal text-xl">
            {totalVisits ?? 0}
          </h3>
        </div>
      </CardHeader>
      <CardContent>
        <BarChart
          data={chartData}
          index="Date"
          categories={["Number of visits"]}
          colors={["blue"]}
          className="h-32"
          showXAxis={false}
          showYAxis={false}
          showLegend={false}
          showGridLines={false}
        />
      </CardContent>
    </Card>
  );
};

export default Trend;
