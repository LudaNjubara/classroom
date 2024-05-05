import { cn } from "@/utils/cn";
import { SidebarChannelSection } from "./SidebarChannelSection";

type TClassroomSidebarProps = {
  className?: string;
};

export function ClassroomSidebar({ className }: TClassroomSidebarProps) {
  return (
    <aside className={cn("", className)}>
      <SidebarChannelSection />
    </aside>
  );
}
