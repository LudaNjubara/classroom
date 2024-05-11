import { GridView } from "@/components/Elements";
import { ResourceItemSkeleton } from "@/components/Loaders";
import { ResourceItem } from "@/components/Resource";
import { useClassroomResources } from "@/features/classrooms/hooks/useClassroomResources";
import { useDashboardStore } from "@/stores";

export function ContentFiles() {
  // zustand state and actions
  const selectedClassroom = useDashboardStore((state) => state.selectedClassroom);

  // hooks
  const {
    data: resources,
    isLoading,
    refetch: refetchResources,
  } = useClassroomResources(selectedClassroom?.id);

  return (
    <div>
      {isLoading && (
        <GridView className="md:grid-cols-1 lg:grid-cols-1 gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <ResourceItemSkeleton key={i} />
          ))}
        </GridView>
      )}

      {!isLoading && resources.length === 0 && (
        <div className="text-center text-slate-500 dark:text-slate-400">No resources found</div>
      )}

      {!isLoading &&
        resources.length > 0 &&
        resources.map((resource) => <ResourceItem key={resource.id} data={resource} />)}
    </div>
  );
}
