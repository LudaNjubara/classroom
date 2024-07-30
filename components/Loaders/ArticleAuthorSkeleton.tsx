import { Skeleton } from "../ui/skeleton";

export function ArticleAuthorSkeleton() {
  return (
    <div className="flex items-start gap-4">
      <Skeleton className="w-10 h-10 rounded-full" />

      <div>
        <Skeleton className="w-32 h-4 rounded" />
        <Skeleton className="w-16 h-3 rounded mt-2" />
      </div>
    </div>
  );
}
