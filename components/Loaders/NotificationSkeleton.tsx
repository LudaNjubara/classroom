import { Skeleton } from "@/components/ui/skeleton";

export function NotificationSkeleton() {
  return (
    <div className="p-4 bg-slate-500/30 dark:bg-slate-600/30 rounded-lg my-2 animate-pop-up">
      <div className="flex justify-between">
        <div>
          <Skeleton className="w-1/2 h-8"></Skeleton>

          <Skeleton className="w-3/4 h-4 mt-2"></Skeleton>
        </div>

        <div className="flex items-center gap-4">
          <Skeleton className="w-1/4 h-8"></Skeleton>
          <Skeleton className="w-24 h-8"></Skeleton>
        </div>
      </div>
    </div>
  );
}
