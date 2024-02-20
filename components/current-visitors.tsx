import { cn } from "@/lib/utils";

interface CurrentVisitorsProps {
  visitors: number;
}

const CurrentVisitors = ({ visitors }: CurrentVisitorsProps) => {
  return (
    <div className="flex items-center gap-2">
      <span
        className={cn(
          "rounded-full h-2 w-2",
          visitors ? "bg-green-500" : "bg-muted"
        )}
      />
      <p className="text-neutral-64 truncate">{`${visitors} current visitor${
        visitors === 1 ? "" : "s"
      }`}</p>
    </div>
  );
};

export default CurrentVisitors;
