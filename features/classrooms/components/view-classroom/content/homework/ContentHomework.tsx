import { CustomModal, GridView } from "@/components/Elements";
import { NotificationSkeleton } from "@/components/Loaders";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useDashboardContext } from "@/context";
import { useClassroomAssignments } from "@/features/classrooms/hooks/useClassroomAssignments";
import { TClassroomAssignmentWithTeacher } from "@/features/classrooms/types";
import { useDisclosure } from "@/hooks/useDisclosure";
import { useDashboardStore } from "@/stores";
import { ClassroomAssignment } from "@prisma/client";
import { PlusIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { createPortal } from "react-dom";
import { CreateNewAssignmentModal } from "./create-assignment/CreateNewAssignmentModal";
import { AssignmentDetailsModal } from "./view-assignment/AssignmentDetailsModal";
import { ClassroomAssignmentList } from "./view-assignments/ClassroomAssignmentList";

export function ContentHomework() {
  // context
  const { profile } = useDashboardContext();

  // zustand state and actions
  const selectedClassroom = useDashboardStore((state) => state.selectedClassroom);

  // state
  const [selectedAssignment, setSelectedAssignment] = useState<TClassroomAssignmentWithTeacher | null>(null);

  // hooks
  const {
    data: classroomAssignments,
    isLoading: isClassroomAssignmentsLoading,
    refetch: refetchClassroomAssignments,
  } = useClassroomAssignments(selectedClassroom?.id);

  const { isOpen: isCreateNewAssignmentModalOpen, toggle: toggleCreateNewAssignmentModal } = useDisclosure();

  // hnadlers
  const handleAssignmentItemClick = (assignment: TClassroomAssignmentWithTeacher) => {
    setSelectedAssignment(assignment);
  };

  return (
    <div className="relative pb-20">
      {/* Homework content */}
      {isClassroomAssignmentsLoading && (
        <GridView className="md:grid-cols-1 lg:grid-cols-1 gap-2">
          {[...Array(5)].map((_, index) => (
            <NotificationSkeleton key={index} />
          ))}
        </GridView>
      )}

      {!isClassroomAssignmentsLoading && classroomAssignments.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-5 py-8 tracking-wide">
          <Image src="/no-assignments.svg" alt="No assignments" width={300} height={300} />
          <p className="text-slate-500 text-lg font-semibold">No assignments yet</p>
        </div>
      )}

      {!isClassroomAssignmentsLoading && classroomAssignments.length > 0 && (
        <ClassroomAssignmentList
          assignments={classroomAssignments}
          onRefetch={refetchClassroomAssignments}
          onItemClick={handleAssignmentItemClick}
        />
      )}

      {/* New assignment button container */}
      {profile.role === "TEACHER" && (
        <div className="absolute bottom-4 right-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={toggleCreateNewAssignmentModal}
                  size="icon"
                  variant="default"
                  className="rounded-full"
                >
                  <PlusIcon size={24} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Create new assignment</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}

      {/* Create new assignment modal */}
      {isCreateNewAssignmentModalOpen &&
        createPortal(
          <CustomModal>
            <CreateNewAssignmentModal
              onClose={toggleCreateNewAssignmentModal}
              classroomId={selectedClassroom?.id!}
              onAssignmentCreated={() => {
                refetchClassroomAssignments();
                toggleCreateNewAssignmentModal();
              }}
            />
          </CustomModal>,
          document.getElementById("view-classroom-container")!
        )}

      {/* Assignment details modal */}
      {selectedAssignment &&
        createPortal(
          <CustomModal>
            <AssignmentDetailsModal
              assignment={selectedAssignment}
              onClose={() => setSelectedAssignment(null)}
              onAssignmentUpdated={(updatedAssignment: ClassroomAssignment) => {
                refetchClassroomAssignments();
                setSelectedAssignment({
                  ...selectedAssignment,
                  title: updatedAssignment.title,
                  description: updatedAssignment.description,
                  dueDate: updatedAssignment.dueDate,
                });
              }}
              onAssignmentRevoked={() => {
                refetchClassroomAssignments();
                setSelectedAssignment(null);
              }}
            />
          </CustomModal>,
          document.getElementById("view-classroom-container")!
        )}
    </div>
  );
}
