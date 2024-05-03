import { Skeleton } from "../ui/skeleton";

export function ClassroomCardSkeleton() {
  return (
    <div className="w-full dark:bg-slate-900 bg-slate-400 p-5 rounded-lg">
      <div className="flex flex-col gap-4">
        <Skeleton className="w-2/3 h-8" />
        <div className="flex flex-col gap-2">
          <Skeleton className="w-full h-4" />
          <Skeleton className="w-full h-4" />
          <Skeleton className="w-1/3 h-4" />
        </div>
      </div>
    </div>
  );
}
