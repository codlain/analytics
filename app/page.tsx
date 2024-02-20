import { DateFilter } from "@/components/date-filter";
import InView from "@/components/in-view";
import { KpisWidget } from "@/components/kpis-widget";
import { TopPagesWidget } from "@/components/top-pages-widget";
import TrendWidget from "@/components/trend-widget";
import {
  getDomain,
  getKpiTotals,
  getKpis,
  getTopPages,
  getTrend,
} from "@/lib/tinybird";
import { KpiType } from "@/types/kpis";
import { TopPagesSorting } from "@/types/top-pages";
import { Suspense } from "react";

const enum WidgetHeight {
  XLarge = 588,
  Large = 472,
  Medium = 344,
  Small = 216,
}

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
  const kpiTotalsData = await getKpiTotals();

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

  return (
    <div className="min-h-screen px-5 py-5 text-sm leading-5 sm:px-10 text-secondary">
      <DateFilter />
      <div className="mx-auto max-w-7xl">
        <div className="space-y-6 sm:space-y-10">
          <div className="grid grid-cols-2 gap-5 sm:gap-10 grid-rows-3-auto">
            <div className="col-span-2" style={{ height: WidgetHeight.XLarge }}>
              <Suspense>
                <KpisWidget kpiTotalsData={kpiTotalsData} kpisData={kpisData} />
              </Suspense>
            </div>
            <div className="col-start-1 col-span-2 lg:col-span-1 grid grid-cols-1 gap-5 sm:gap-10 grid-rows-3-auto">
              <InView height={WidgetHeight.Small}>
                <Suspense>
                  <TrendWidget data={trendData} />
                </Suspense>
              </InView>
              <InView height={WidgetHeight.Large}>
                <TopPagesWidget domainData={domainData} data={topPagesData} />
              </InView>
              <InView height={WidgetHeight.Large}>
                <>{/* <TopLocationsWidget /> */}</>
              </InView>
            </div>
            <div className="col-start-1 col-span-2 lg:col-start-2 lg:col-span-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-5 sm:gap-10 grid-rows-2-auto lg:grid-rows-3-auto">
              <div className="col-span-1 md:col-span-2 lg:col-span-1">
                <InView height={WidgetHeight.Large}>
                  <>{/* <TopSourcesWidget /> */}</>
                </InView>
              </div>
              <InView height={WidgetHeight.Medium}>
                <>{/* <TopDevicesWidget /> */}</>
              </InView>
              <InView height={WidgetHeight.Medium}>
                <>{/* <BrowsersWidget /> */}</>
              </InView>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
