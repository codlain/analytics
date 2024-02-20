import { usePathname, useRouter, useSearchParams } from "next/navigation";
import useDateFilter from "@/hooks/use-date-filter";
import { KPI_OPTIONS, KpiType, isKpi } from "@/types/kpis";

export default function useKpis() {
  const { from, to } = useDateFilter();
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
