import { KPI_OPTIONS, KpiType } from "@/types/kpis";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { getKpiTotals, getKpis } from "@/lib/tinybird";
import { PageWithSearchParams } from "@/types";
import { Tabs } from "./tabs";
import { AreaChart } from "./area-chart";

interface KpisProps extends PageWithSearchParams {}

const Kpis = async ({ searchParams }: KpisProps) => {
  const kpi = (searchParams?.kpi || "pageviews") as KpiType;

  const kpiTotalsData = await getKpiTotals(
    searchParams?.date_from,
    searchParams?.date_to
  );

  const kpisData = await getKpis(
    kpi,
    searchParams?.date_from,
    searchParams?.date_to
  );

  const kpiOption = KPI_OPTIONS.find(({ value }) => value === kpi)!;

  const chartData = (kpisData?.dates ?? []).map((date, index) => {
    const value = Math.max(
      Number(kpisData?.data[0][index]) || 0,
      Number(kpisData?.data[1][index]) || 0
    );

    return {
      date: date.toUpperCase(),
      [kpiOption.label]: value,
    };
  });

  return (
    <Card>
      <CardTitle className="sr-only">KPIs</CardTitle>
      <Tabs totals={kpiTotalsData} />
      <CardContent className="pt-2 mt-4">
        <AreaChart kpi={kpi} data={chartData} />
      </CardContent>
    </Card>
  );
};

export default Kpis;
