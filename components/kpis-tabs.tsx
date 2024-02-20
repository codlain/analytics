import { KpiTotals, KpiType, KPI_OPTIONS } from "@/types/kpis";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import useKpis from "@/hooks/use-kpis";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

type KpisTabsProps = {
  totals?: KpiTotals;
};

export const KpisTabs = ({ totals }: KpisTabsProps) => {
  const { kpi, setKpi } = useKpis();
  return (
    <div className="">
      {KPI_OPTIONS.map(({ label, value, formatter }) => (
        <Button
          onClick={() => setKpi(value)}
          key={value}
          variant={value === kpi ? "secondary" : "ghost"}
          className="px-8 py-16"
        >
          <span>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pl-0">
              <CardTitle className="text-sm font-medium">{label}</CardTitle>
            </CardHeader>
            <CardContent className="pl-0">
              <div className="text-2xl font-bold text-left">
                {totals ? formatter(totals[value]) : "-"}
              </div>
            </CardContent>
          </span>
        </Button>
      ))}
    </div>
  );
};
