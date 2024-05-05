import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/utils/cn";

type TClassroomHeaderProps = {
  className?: string;
};

export function ClassroomContentHeader({ className }: TClassroomHeaderProps) {
  return (
    <header className={cn("", className)}>
      <Tabs defaultValue="posts" className="w-full">
        <TabsList className="grid w-full grid-cols-3 gap-1">
          <TabsTrigger className="hover:bg-slate-300/80 dark:hover:bg-slate-900/80" value="posts">
            Posts
          </TabsTrigger>
          <TabsTrigger className="hover:bg-slate-300/80 dark:hover:bg-slate-900/80" value="files">
            Files
          </TabsTrigger>
          <TabsTrigger className="hover:bg-slate-300/80 dark:hover:bg-slate-900/80" value="homework">
            Homework
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </header>
  );
}
