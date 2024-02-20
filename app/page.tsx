import CurrentVisitors from "@/components/current-visitors";
import { DateFilter } from "@/components/date-filter";
import { KpisWidget } from "@/components/kpis-widget";
import { TopPagesWidget } from "@/components/top-pages-widget";
import TrendWidget from "@/components/trend-widget";
import {
  getDomain,
  getKpiTotals,
  getKpis,
  getTopPages,
  getTrend,
  querySQL,
} from "@/lib/tinybird";
import { KpiType } from "@/types/kpis";
import { TopPagesSorting } from "@/types/top-pages";

const DashboardPage = async ({
  searchParams,
}: {
  searchParams?: {
    kpi?: string;
    date_from?: string;
    date_to?: string;
    top_pages_sorting?: string;
    last_days?: string;
  };
}) => {
  const kpiTotalsData = await getKpiTotals(
    searchParams?.date_from,
    searchParams?.date_to
  );

  const kpi = (searchParams?.kpi || "pageviews") as KpiType;
  const kpisData = await getKpis(
    kpi,
    searchParams?.date_from,
    searchParams?.date_to
  );

  const trendData = await getTrend(
    searchParams?.date_from,
    searchParams?.date_to
  );

  const topPagesSorting = searchParams?.top_pages_sorting as TopPagesSorting;
  const domainData = await getDomain();
  const topPagesData = await getTopPages(
    topPagesSorting,
    searchParams?.date_from,
    searchParams?.date_to
  );

  const currentVisitors = await querySQL<{ visits: number }>(
    `SELECT uniq(session_id) AS visits FROM analytics_hits
      WHERE timestamp >= (now() - interval 5 minute) FORMAT JSON`
  ).then((resp) => resp.data[0]?.visits || 0);

  return (
    <div className="min-h-screen px-5 py-5 text-sm leading-5 sm:px-10">
      <div className="flex flex-col gap-4 mx-auto max-w-7xl">
        <div className="flex justify-between">
          <div className="flex items-center gap-4">
            <span className="text-lg leading-6">DOMAIN</span>
            <CurrentVisitors visitors={currentVisitors} />
          </div>
          <DateFilter />
        </div>
        <div className="space-y-6 sm:space-y-10">
          <div className="grid grid-cols-2 gap-5 sm:gap-10 grid-rows-3-auto">
            <div className="col-span-2">
              <KpisWidget kpiTotalsData={kpiTotalsData} kpisData={kpisData} />
            </div>
            <div className="col-start-1 col-span-2 lg:col-span-1 grid grid-cols-1 gap-5 sm:gap-10 grid-rows-3-auto">
              <TrendWidget data={trendData} />
              <TopPagesWidget domainData={domainData} data={topPagesData} />
              <>{/* <TopLocationsWidget /> */}</>
            </div>
            <div className="col-start-1 col-span-2 lg:col-start-2 lg:col-span-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-5 sm:gap-10 grid-rows-2-auto lg:grid-rows-3-auto">
              <div className="col-span-1 md:col-span-2 lg:col-span-1">
                <>{/* <TopSourcesWidget /> */}</>
              </div>
              <>{/* <TopDevicesWidget /> */}</>
              <>{/* <BrowsersWidget /> */}</>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
