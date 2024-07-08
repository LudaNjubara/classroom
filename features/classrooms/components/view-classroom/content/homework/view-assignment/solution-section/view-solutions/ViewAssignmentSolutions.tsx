import { CustomModal, GridView } from "@/components/Elements";
import { NotificationSkeleton } from "@/components/Loaders";
import { useClassroomAssignmentSolutions } from "@/features/classrooms/hooks/useClassroomAssignmentSolutions";
import { TAssignmentSolutionWithStudent, TClassroomAssignmentWithTeacher } from "@/features/classrooms/types";
import { useState } from "react";
import { createPortal } from "react-dom";
import { AssignmentSolutionDetailsModal } from "../view-solution/AssignmentSolutionDetailsModal";
import { AssignmentSolutionsList } from "./AssignmentSolutionsList";

type TViewAssignmentSolutionsProps = {
  assignmentId: string;
  classroomAssignment: TClassroomAssignmentWithTeacher | null;
};

export function ViewAssignmentSolutions({
  assignmentId,
  classroomAssignment,
}: TViewAssignmentSolutionsProps) {
  // state
  const [selectedAssignmentSolution, setSelectedAssignmentSolution] =
    useState<TAssignmentSolutionWithStudent | null>(null);

  // hooks
  const {
    data: solutions,
    isLoading: isSolutionsLoading,
    error: solutionsError,
    refetch: refetchSolutions,
  } = useClassroomAssignmentSolutions(assignmentId);

  // handlers
  const handleItemClick = (assignmentSolution: TAssignmentSolutionWithStudent) => {
    setSelectedAssignmentSolution(assignmentSolution);
  };

  return (
    <div>
      {isSolutionsLoading && (
        <GridView className="md:grid-cols-1 lg:grid-cols-1 gap-2">
          {Array.from({ length: 3 }).map((_, index) => (
            <NotificationSkeleton key={index} />
          ))}
        </GridView>
      )}

      {!isSolutionsLoading && !solutions.length && (
        <p className=" text-slate-500 py-5 text-center">No solutions submitted yet</p>
      )}

      {!isSolutionsLoading && solutions.length > 0 && (
        <AssignmentSolutionsList
          assignmentSolutions={solutions}
          onRefetch={refetchSolutions}
          onItemClick={handleItemClick}
        />
      )}

      {/* Assignment solution details modal */}
      {selectedAssignmentSolution &&
        classroomAssignment &&
        createPortal(
          <CustomModal>
            <AssignmentSolutionDetailsModal
              classroomAssignment={classroomAssignment}
              assignmentSolution={selectedAssignmentSolution}
              onClose={() => setSelectedAssignmentSolution(null)}
              onSuccessfulGrade={() => {
                refetchSolutions();
                setSelectedAssignmentSolution(null);
              }}
            />
          </CustomModal>,
          document.getElementById("view-classroom-assignment-container")!
        )}
    </div>
  );
}
