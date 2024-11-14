import { TabsContent } from "@/components/ui/tabs";
import { useDashboardContext } from "@/context";
import { CallActions } from "@/features/call";
import { useChannelResources } from "@/features/classrooms/hooks/useChannelResources";
import { useClassroomResources } from "@/features/classrooms/hooks/useClassroomResources";
import { useDashboardStore } from "@/stores";
import { cn } from "@/utils/cn";
import { Role } from "@prisma/client";
import { ContentFiles } from "./ContentFiles";
import { ContentPosts } from "./ContentPosts";
import { ContentHomework } from "./homework/ContentHomework";
import { ContentInsights } from "./insights/ContentInsights";

type TAllowedRoles = Exclude<Role, "ADMIN" | "GUEST" | "ORGANIZATION">;

const allowedRolesForCallActions: TAllowedRoles[] = ["TEACHER", "STUDENT"];

type TClassroomContentProps = {
  className?: string;
};

export function ClassroomContent({ className }: TClassroomContentProps) {
  // context
  const { profile } = useDashboardContext();

  // zustand state and actions
  const selectedChannel = useDashboardStore((state) => state.selectedChannel);
  const selectedClassroom = useDashboardStore((state) => state.selectedClassroom);

  // hooks
  const classroomResourcesState = useClassroomResources(selectedClassroom?.id);
  const channelResourcesState = useChannelResources(selectedChannel?.id);

  return (
    <div className={cn("w-full bg-slate-400 dark:bg-slate-900 rounded-lg py-2 px-4", className)}>
      {/* Call actions */}
      {allowedRolesForCallActions.includes(profile.role as TAllowedRoles) && (
        <div className="mb-4 pb-2 flex items-center justify-end bg-slate-900 border-b-2 border-slate-700/40">
          <CallActions />
        </div>
      )}

      {/* Channel content */}
      <TabsContent value="posts">
        <ContentPosts />
      </TabsContent>

      <TabsContent value="files">
        <ContentFiles
          classroomResourcesState={classroomResourcesState}
          channelResourcesState={channelResourcesState}
        />
      </TabsContent>

      <TabsContent value="homework">
        <ContentHomework />
      </TabsContent>

      <TabsContent value="insights">
        <ContentInsights />
      </TabsContent>
    </div>
  );
}
