import { DateFilter } from "@/components/date-filter";
import { getCurrentVisitors, getDomain } from "@/lib/tinybird";
import { cn } from "@/lib/utils";

const DashboardPage = async () => {
  const { domain } = await getDomain();
  const currentVisitors = await getCurrentVisitors();

  return (
    <div className="flex justify-between">
      <div className="flex items-center gap-4">
        <span className="text-lg leading-6">{domain}</span>
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
