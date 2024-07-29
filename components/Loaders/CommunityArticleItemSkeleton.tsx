import { Skeleton } from "../ui/skeleton";

export function CommunityArticleItemSkeleton() {
  return (
    <div className="rounded-xl dark:bg-slate-900 overflow-hidden">
      <Skeleton className="h-32 w-full" />

      <div className="p-4">
        <div className="flex items-center gap-2 pb-2">
          <Skeleton className="h-5 w-10" />
          <Skeleton className="h-5 w-10" />
          <Skeleton className="h-5 w-10" />
        </div>

        <Skeleton className="h-8 w-full" />

        <Skeleton className="h-3 w-2/3 mt-2" />

        <Skeleton className="h-5 w-32 mt-4" />
      </div>
    </div>
  );
}
