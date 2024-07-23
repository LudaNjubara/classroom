import { GridView } from "@/components/Elements";
import { ResourceItemSkeleton } from "@/components/Loaders";
import { ResourceItem } from "@/components/Resource";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { TResourceWithMetadata } from "@/features/classrooms/types";
import { useStatistics } from "@/providers/statistics-provider";
import { useDashboardStore } from "@/stores";
import { EClassroomStatisticsEvent } from "@/types/enums";

type TContentFilesProps = {
  classroomResourcesState: {
    isLoading: boolean;
    data: TResourceWithMetadata[];
    refetch: () => void;
  };
  channelResourcesState: {
    isLoading: boolean;
    data: TResourceWithMetadata[];
    refetch: () => void;
  };
};

export function ContentFiles({ classroomResourcesState, channelResourcesState }: TContentFilesProps) {
  // context
  const { trackEvent } = useStatistics();

  // zustand state and actions
  const selectedClassroom = useDashboardStore((state) => state.selectedClassroom);

  // handlers
  const handleStatistic = () => {
    if (!selectedClassroom) return;

    console.log("Sending classroom resource download count statistics");

    trackEvent(
      EClassroomStatisticsEvent.TOTAL_CLASSROOM_RESOURCE_DOWNLOAD_COUNT,
      {
        classroomId: selectedClassroom.id,
      },
      {
        count: 1,
      }
    );
  };

  return (
    <div className="pr-2 max-h-[390px] overflow-y-auto">
      <Accordion type="multiple" defaultValue={["classroom-resources"]}>
        <AccordionItem value="classroom-resources">
          <AccordionTrigger>Classroom resources</AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col gap-1">
              {classroomResourcesState.isLoading && (
                <GridView className="md:grid-cols-1 lg:grid-cols-1 gap-2">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <ResourceItemSkeleton key={i} />
                  ))}
                </GridView>
              )}

              {!classroomResourcesState.isLoading && classroomResourcesState.data.length === 0 && (
                <div className="text-center text-slate-500 dark:text-slate-400">
                  No classroom resources found
                </div>
              )}

              {!classroomResourcesState.isLoading &&
                classroomResourcesState.data.length > 0 &&
                classroomResourcesState.data.map((resource) => (
                  <ResourceItem key={resource.id} data={resource} statisticsHandler={handleStatistic} />
                ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="channel-resources">
          <AccordionTrigger>Channel resources</AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col gap-1">
              {channelResourcesState.isLoading && (
                <GridView className="md:grid-cols-1 lg:grid-cols-1 gap-2">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <ResourceItemSkeleton key={i} />
                  ))}
                </GridView>
              )}

              {!channelResourcesState.isLoading && channelResourcesState.data.length === 0 && (
                <div className="text-center text-slate-500 dark:text-slate-400">
                  No channel resources found
                </div>
              )}

              {!channelResourcesState.isLoading &&
                channelResourcesState.data.length > 0 &&
                channelResourcesState.data.map((resource) => (
                  <ResourceItem key={resource.id} data={resource} />
                ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
