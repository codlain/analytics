"use client";

import { KpiTotals, KPI_OPTIONS } from "@/types/kpis";
import { Button } from "@/components/ui/button";
import useKpis from "@/hooks/use-kpis";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type TabsProps = {
  totals?: KpiTotals;
};

export const Tabs = ({ totals }: TabsProps) => {
  const { kpi, setKpi } = useKpis();
  return (
    <div className="">
      {KPI_OPTIONS.map(({ label, value, formatter }) => (
        <Button
          onClick={() => setKpi(value)}
          key={value}
          variant={value === kpi ? "secondary" : "ghost"}
          className="px-12 py-16"
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
