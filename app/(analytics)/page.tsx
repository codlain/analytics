import { DateFilter } from "@/components/date-filter";

import { querySQL } from "@/lib/tinybird";
import { cn } from "@/lib/utils";

const DashboardPage = async () => {
  const currentVisitors = await querySQL<{ visits: number }>(
    `SELECT uniq(session_id) AS visits FROM analytics_hits
      WHERE timestamp >= (now() - interval 5 minute) FORMAT JSON`
  ).then((resp) => resp.data[0]?.visits || 0);

  return (
    <div className="flex justify-between">
      <div className="flex items-center gap-4">
        <span className="text-lg leading-6">DOMAIN</span>
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "rounded-full h-2 w-2",
              currentVisitors ? "bg-green-500" : "bg-muted"
            )}
          />
          <p className="text-neutral-64 truncate">{`${currentVisitors} current visitor${
            currentVisitors === 1 ? "" : "s"
          }`}</p>
        </div>
      </div>
      <DateFilter />
    </div>
  );
};

export default DashboardPage;
