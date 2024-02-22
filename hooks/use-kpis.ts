"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { KPI_OPTIONS, KpiType, isKpi } from "@/types/kpis";

export default function useKpis() {
  const pathname = usePathname();
  const { replace } = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const kpiParam = params.get("kpi");

  const kpi = isKpi(kpiParam) ? kpiParam : "visits";
  const kpiOption = KPI_OPTIONS.find(({ value }) => value === kpi)!;

  const setKpi = (kpi: KpiType) => {
    params.set("kpi", kpi);

    replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return {
    setKpi,
    kpi,
    kpiOption,
  };
}
