import { Skeleton } from "../ui/skeleton";

export function InsightSummarySkeleton() {
  return (
    <div className="flex flex-col gap-2 animate-pop-up">
      <Skeleton className="w-full h-4 bg-slate-800" />
      <Skeleton className="w-full h-4 bg-slate-800" />
      <Skeleton className="w-full h-4 bg-slate-800" />
      <Skeleton className="w-full h-4 bg-slate-800" />
      <Skeleton className="w-2/3 h-4 bg-slate-800" />
    </div>
  );
}
