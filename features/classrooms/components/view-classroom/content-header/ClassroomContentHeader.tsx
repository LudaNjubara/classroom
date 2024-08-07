import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDashboardContext } from "@/context";
import { useMiscStore } from "@/stores";
import { cn } from "@/utils/cn";

type TClassroomHeaderProps = {
  className?: string;
};

export function ClassroomContentHeader({ className }: TClassroomHeaderProps) {
  // context
  const { profile } = useDashboardContext();

  // zustand state and actions
  const numOfModalsOpen = useMiscStore((state) => state.numOfModalsOpen);

  return (
    <header className={cn(`${numOfModalsOpen === 2 && "z-10"}`, className)}>
      <TabsList className={`grid w-full gap-1 ${profile.role !== "STUDENT" ? "grid-cols-4" : "grid-cols-3"}`}>
        <TabsTrigger className="hover:bg-slate-300/80 dark:hover:bg-slate-900/80" value="posts">
          Posts
        </TabsTrigger>
        <TabsTrigger className="hover:bg-slate-300/80 dark:hover:bg-slate-900/80" value="files">
          Files
        </TabsTrigger>
        <TabsTrigger className="hover:bg-slate-300/80 dark:hover:bg-slate-900/80" value="homework">
          Homework
        </TabsTrigger>
        {profile.role !== "STUDENT" && (
          <TabsTrigger className="hover:bg-slate-300/80 dark:hover:bg-slate-900/80" value="insights">
            Insights
          </TabsTrigger>
        )}
      </TabsList>
    </header>
  );
}
