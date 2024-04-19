import { Skeleton } from "@/components/ui/skeleton";

export function NotificationSkeleton() {
  return (
    <div className="p-4 bg-slate-500/30 dark:bg-slate-600/30 rounded-lg my-2 animate-pop-up">
      <div className="flex gap-4">
        <div className="flex-1">
          <div className="flex flex-col gap-4">
            <Skeleton className="w-32 h-3"></Skeleton>

            <div className="flex flex-col gap-2">
              <Skeleton className="w-52 h-4"></Skeleton>
              <Skeleton className="w-[70%] h-8"></Skeleton>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Skeleton className="w-20 h-8"></Skeleton>
          <Skeleton className="w-20 h-8"></Skeleton>
        </div>
      </div>
    </div>
  );
}
