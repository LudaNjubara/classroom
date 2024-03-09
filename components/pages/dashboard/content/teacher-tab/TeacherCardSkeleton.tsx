import { Skeleton } from "@/components/ui/skeleton";

export default function TeacherCardSkeleton() {
  return (
    <div className="flex gap-3 rounded-lg bg-slate-400 dark:bg-slate-900 overflow-hidden animate-pop-up">
      <div className="relative basis-20 flex-shrink-0">
        <Skeleton className="w-20 h-20" />
      </div>

      <div className="flex-1 py-4 px-2">
        <Skeleton className="w-24 h-4"></Skeleton>
        <Skeleton className="w-32 h-4 mt-2"></Skeleton>
      </div>
    </div>
  );
}
