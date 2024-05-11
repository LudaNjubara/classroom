import { GridView } from "@/components/Elements";
import { ResourceItemSkeleton } from "@/components/Loaders";
import { ResourceItem } from "@/components/Resource";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { TResourceWithMetadata } from "@/features/classrooms/types";

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
  return (
    <div>
      <Accordion type="multiple" defaultValue={["classroom-resources"]}>
        <AccordionItem value="classroom-resources">
          <AccordionTrigger>Classroom resources</AccordionTrigger>
          <AccordionContent>
            <div>
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
                  <ResourceItem key={resource.id} data={resource} />
                ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="channel-resources">
          <AccordionTrigger>Channel resources</AccordionTrigger>
          <AccordionContent>
            <div>
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
