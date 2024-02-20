import {
  ClientResponse,
  PipeParams,
  QueryPipe,
  QuerySQL,
  QueryError,
} from "@/types/api";
import { ChartData, ChartValue } from "@/types/charts";
import { KpiTotals, KpiType, KpisData } from "@/types/kpis";
import moment from "moment";
import { arrayHasCurrentDate } from "./utils";
import { TopBrowsers, TopBrowsersData, browsers } from "@/types/top-browsers";
import { TopDevices, TopDevicesData, devices } from "@/types/top-devices";
import {
  TopLocation,
  TopLocationsData,
  TopLocationsSorting,
} from "@/types/top-locations";
import { TopPagesData, TopPagesSorting } from "@/types/top-pages";
import { TopSource, TopSources } from "@/types/top-sources";
import { Trend, TrendData } from "@/types/trend";
import { DomainData, DomainQueryData } from "@/types/domain";

export async function client<T>(
  path: string,
  params?: RequestInit
): Promise<ClientResponse<T>> {
  const token = process.env.TINYBIRD_TOKEN;

  const response = await fetch(`https://ui.tinybird.co/v0${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    ...params,
  });
  const data = (await response.json()) as ClientResponse<T>;

  if (!response.ok) {
    throw new QueryError(
      data?.error ?? "Something went wrong",
      response.status
    );
  }
  return data;
}

export function queryPipe<T>(
  name: string,
  params: Partial<PipeParams<T>> = {}
): Promise<QueryPipe<T>> {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (!value) return;
    searchParams.set(key, value);
  });

  return client(`/pipes/${name}.json?${searchParams}`);
}

export function querySQL<T>(sql: string): Promise<QuerySQL<T>> {
  return client(`/sql?q=${sql}`);
}

export const getKpiTotals = async (
  date_from?: string,
  date_to?: string
): Promise<KpiTotals> => {
  /**
   * If we sent the same value for date_from and date_to, the result is one row per hour.
   *
   * But we actually need one row per date, so we're sending one extra day in the filter,
   * and removing ir afterwards.
   *
   * Not the best approach, it'd be better to modify the kpis endpoint. But we don't want
   * to break the backwards compatibility (breaking the dashboard for alreayd active users).
   *
   */
  let date_to_aux = date_to ? new Date(date_to) : new Date();
  date_to_aux.setDate(date_to_aux.getDate() + 1);
  const date_to_aux_str = date_to_aux.toISOString().substring(0, 10);

  const { data } = await queryPipe<KpisData>("kpis", {
    date_from,
    date_to: date_to_aux_str,
  });

  const queryData = data.filter((record) => record["date"] != date_to_aux_str);

  // Sum total KPI value from the trend
  const _KPITotal = (kpi: KpiType) =>
    queryData.reduce((prev, curr) => (curr[kpi] ?? 0) + prev, 0);

  // Get total number of sessions
  const totalVisits = _KPITotal("visits");

  // Sum total KPI value from the trend, ponderating using sessions
  const _ponderatedKPIsTotal = (kpi: KpiType) =>
    queryData.reduce(
      (prev, curr) => prev + ((curr[kpi] ?? 0) * curr["visits"]) / totalVisits,
      0
    );

  return {
    avg_session_sec: _ponderatedKPIsTotal("avg_session_sec"),
    pageviews: _KPITotal("pageviews"),
    visits: totalVisits,
    bounce_rate: _ponderatedKPIsTotal("bounce_rate"),
  };
};

export const getKpis = async (
  kpi: KpiType,
  date_from?: string,
  date_to?: string
): Promise<ChartData> => {
  const { data: queryData } = await queryPipe<KpisData>("kpis", {
    date_from,
    date_to,
  });
  const isHourlyGranularity = !!date_from && !!date_to && date_from === date_to;
  const dates = queryData.map(({ date }) =>
    moment(date).format(isHourlyGranularity ? "HH:mm" : "MMM DD, YYYY")
  );
  const isCurrentData = arrayHasCurrentDate(dates, isHourlyGranularity);

  const data = isCurrentData
    ? queryData.reduce(
        (acc, record, index) => {
          const value = record[kpi] ?? 0;

          const pastValue = index < queryData.length - 1 ? value : "";
          const currentValue = index > queryData.length - 3 ? value : "";

          const [pastPart, currentPart] = acc;

          return [
            [...pastPart, pastValue],
            [...currentPart, currentValue],
          ];
        },
        [[], []] as ChartValue[][]
      )
    : [queryData.map((value) => value[kpi] ?? 0), [""]];

  return {
    dates,
    data,
  };
};

export const getTopBrowsers = async (
  date_from?: string,
  date_to?: string
): Promise<TopBrowsers> => {
  const { data: queryData } = await queryPipe<TopBrowsersData>("top_browsers", {
    date_from,
    date_to,
    limit: 4,
  });
  const data = [...queryData]
    .sort((a, b) => b.visits - a.visits)
    .map(({ browser, visits }) => ({
      browser: browsers[browser] ?? browser,
      visits,
    }));

  return { data };
};

export const getTopDevices = async (
  date_from?: string,
  date_to?: string
): Promise<TopDevices> => {
  const { data: queryData } = await queryPipe<TopDevicesData>("top_devices", {
    date_from,
    date_to,
    limit: 4,
  });
  const data = [...queryData]
    .sort((a, b) => b.visits - a.visits)
    .map(({ device, visits }) => ({
      device: devices[device] ?? device,
      visits,
    }));

  return { data };
};

const getFlagEmoji = (countryCode: string) => {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
};

export const getTopLocations = async (
  sorting: TopLocationsSorting,
  date_from?: string,
  date_to?: string
) => {
  const { data: queryData } = await queryPipe<TopLocationsData>(
    "top_locations",
    { limit: 8, date_from, date_to }
  );
  const regionNames = new Intl.DisplayNames(["en"], { type: "region" });

  const data: TopLocation[] = [...queryData]
    .sort((a, b) => b[sorting] - a[sorting])
    .map(({ location, ...rest }) => {
      const unknownLocation = "🌎  Unknown";
      return {
        location: location
          ? `${getFlagEmoji(location)} ${regionNames.of(location)}`
          : unknownLocation,
        shortLocation: location
          ? `${getFlagEmoji(location)} ${location}`
          : unknownLocation,
        ...rest,
      };
    });

  const locations = data.map(({ location }) => location);
  const labels = data.map((record) => record[sorting]);

  return {
    data,
    locations,
    labels,
  };
};

export const getTopPages = async (
  sorting: TopPagesSorting,
  date_from?: string,
  date_to?: string
) => {
  const { data: queryData, meta } = await queryPipe<TopPagesData>("top_pages", {
    limit: 8,
    date_from,
    date_to,
  });
  const data = [...queryData].sort((a, b) => b[sorting] - a[sorting]);

  const columnLabels = {
    pathname: "content",
    visits: "visitors",
    hits: "pageviews",
  };
  const columns = meta.map(({ name }) => ({
    label: columnLabels[name],
    value: name,
  }));
  const pages = data.map(({ pathname }) => pathname);
  const labels = data.map((record) => record[sorting]);

  return {
    data,
    columns,
    pages,
    labels,
  };
};

export const getTopSources = async (
  date_from?: string,
  date_to?: string
): Promise<TopSources> => {
  const { data: queryData } = await queryPipe<TopSource>("top_sources", {
    limit: 8,
    date_from,
    date_to,
  });

  const data: TopSource[] = [...queryData]
    .sort((a, b) => b.visits - a.visits)
    .map(({ referrer, visits }) => ({
      referrer: referrer || "Direct",
      href: referrer ? `https://${referrer}` : undefined,
      visits,
    }));
  const refs = data.map(({ referrer }) => referrer);
  const visits = data.map(({ visits }) => visits);

  return {
    data,
    refs,
    visits,
  };
};

export async function getTrend(
  date_from?: string,
  date_to?: string
): Promise<Trend> {
  const { data } = await queryPipe<TrendData>("trend", { date_from, date_to });
  const visits = data.map(({ visits }) => visits);
  const dates = data.map(({ t }) => {
    return moment(t).format("HH:mm");
  });
  const totalVisits = visits.reduce((a, b) => a + b, 0);

  return {
    visits,
    dates,
    totalVisits,
    data,
  };
}

const FALLBACK_LOGO = "/fallback-logo.png";

export const getDomain = async (): Promise<DomainData> => {
  // Guess the instrumented domain, and exclude other domains like development or staging.
  //  - Try to get the domain with most hits from the last hour.
  //  - Fallback to 'some' domain.
  // Best balance between data accuracy and performance I can get.
  const { data } = await querySQL<DomainQueryData>(`
    with (
      SELECT nullif(domainWithoutWWW(href),'') as domain
      FROM analytics_hits
      where timestamp >= now() - interval 1 hour
      group by domain
      order by count(1) desc
      limit 1
    ) as top_domain,
    (
      SELECT domainWithoutWWW(href)
      FROM analytics_hits
      where href not like '%localhost%'
      limit 1
    ) as some_domain
    select coalesce(top_domain, some_domain) as domain format JSON
  `);
  const domain = data[0]["domain"];
  const logo = domain ? `https://${domain}/favicon.ico` : FALLBACK_LOGO;

  return {
    domain,
    logo,
  };
};
