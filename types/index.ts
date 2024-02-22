export interface PageWithSearchParams {
  searchParams?: {
    kpi?: string;
    date_from?: string;
    date_to?: string;
    top_pages_sorting?: string;
    last_days?: string;
  };
}

export enum TopPagesSorting {
  Visitors = "visits",
  Pageviews = "hits",
}
