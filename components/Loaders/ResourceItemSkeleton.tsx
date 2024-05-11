import { Skeleton } from "@/components/ui/skeleton";

export function ResourceItemSkeleton() {
  return (
    <div className="py-3 px-4 flex items-center gap-5 rounded-lg dark:bg-slate-800 bg-slate-500 animate-pop-up">
      <Skeleton className="w-6 h-6 bg-slate-700" />

      <div className="flex w-full items-center justify-between gap-5">
        <div className="flex flex-col gap-2">
          <Skeleton className="w-32 h-3 bg-slate-700" />
          <Skeleton className="w-24 h-3 bg-slate-700" />
        </div>

        <Skeleton className="w-10 h-10 bg-slate-700" />
      </div>
    </div>
  );
}
