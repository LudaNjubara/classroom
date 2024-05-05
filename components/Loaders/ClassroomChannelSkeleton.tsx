import { Skeleton } from "@/components/ui/skeleton";

export function ClassroomChannelSkeleton() {
  return (
    <Skeleton className="flex items-center h-10 p-2">
      <Skeleton className="h-1/2 w-2/5 bg-slate-700" />
    </Skeleton>
  );
}
