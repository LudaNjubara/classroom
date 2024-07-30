import { Skeleton } from "../ui/skeleton";

export function ArticleCommentsSkeleton() {
  return (
    <div>
      <div className="flex items-start gap-4">
        <Skeleton className="w-10 h-10 rounded-full" />

        <div>
          <Skeleton className="w-28 h-4" />
        </div>
      </div>

      <div className="mt-4">
        <Skeleton className="w-full h-4" />
        <Skeleton className="w-full h-4 mt-2" />
        <Skeleton className="w-2/3 h-4 mt-2" />
      </div>
    </div>
  );
}
