import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { TClassroomAssignmentWithTeacher } from "@/features/classrooms/types";
import { RotateCwIcon } from "lucide-react";
import { ClassroomAssignmentListItem } from "./ClassroomAssignmentListItem";

type TCLassroomAssignmentListProps = {
  assignments: TClassroomAssignmentWithTeacher[];
  onRefetch: () => void;
  onItemClick: (assignment: TClassroomAssignmentWithTeacher) => void;
};

export function ClassroomAssignmentList({
  assignments,
  onRefetch,
  onItemClick,
}: TCLassroomAssignmentListProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center gap-2">
        <h2 className="text-xl font-semibold">Assignments</h2>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button onClick={onRefetch} className="self-end rounded-full" variant="ghost" size="icon">
                <RotateCwIcon size={24} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Refresh assignments</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Assignment list */}
      <ul className="flex flex-col gap-1">
        {assignments.map((assignment) => (
          <ClassroomAssignmentListItem key={assignment.id} onClick={onItemClick} assignment={assignment} />
        ))}
      </ul>
    </div>
  );
}
