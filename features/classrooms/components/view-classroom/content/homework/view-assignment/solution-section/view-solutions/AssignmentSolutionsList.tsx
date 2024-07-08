import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { TAssignmentSolutionWithStudent } from "@/features/classrooms/types";
import { RotateCwIcon } from "lucide-react";
import AssignmentSolutionListItem from "./AssignmentSolutionListItem";

type TAssignmentSolutionsListProps = {
  assignmentSolutions: TAssignmentSolutionWithStudent[];
  onRefetch: () => void;
  onItemClick: (assignment: TAssignmentSolutionWithStudent) => void;
};

export function AssignmentSolutionsList({
  assignmentSolutions,
  onRefetch,
  onItemClick,
}: TAssignmentSolutionsListProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end items-center gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button onClick={onRefetch} className="self-end rounded-full" variant="ghost" size="icon">
                <RotateCwIcon size={24} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Refresh assignment solutions</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Assignment solutions list */}
      <ul className="flex flex-col gap-1">
        {assignmentSolutions.map((solution) => (
          <AssignmentSolutionListItem key={solution.id} solution={solution} onClick={onItemClick} />
        ))}
      </ul>
    </div>
  );
}
