import { TabsContent } from "@/components/ui/tabs";
import { useDashboardStore } from "@/stores";
import { cn } from "@/utils/cn";
import { ContentFiles } from "./ContentFiles";
import { ContentPosts } from "./ContentPosts";

type TClassroomContentProps = {
  className?: string;
};

export function ClassroomContent({ className }: TClassroomContentProps) {
  // zustand state and actions
  const selectedChannel = useDashboardStore((state) => state.selectedChannel);

  return (
    <div className={cn("w-full bg-slate-900/70 rounded-lg py-2 px-4", className)}>
      {/* Channel name */}
      <div className="mb-8">
        <h3 className="text-xl font-thin tracking-wide">#{selectedChannel?.name}</h3>
      </div>

      {/* Channel content */}
      <TabsContent value="posts">
        <ContentPosts />
      </TabsContent>
      <TabsContent value="files">
        <ContentFiles />
      </TabsContent>
    </div>
  );
}
