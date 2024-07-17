import { Spinner } from "@/components/Loaders";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useDashboardContext } from "@/context";
import { removeClassroomAssignment } from "@/features/classrooms/api/remove-classroom-assignment";
import { updateClassroomAssignment } from "@/features/classrooms/api/update-classroom-assignment";
import { useClassroomAssignmentResources } from "@/features/classrooms/hooks/useClassroomAssignmentResources";
import { TClassroomAssignmentWithTeacher, TEditedAssignment } from "@/features/classrooms/types";
import { validateEditedClassroomAssignment } from "@/features/classrooms/utils";
import { useDisclosure } from "@/hooks/useDisclosure";
import { useMiscStore } from "@/stores";
import { ClassroomAssignment } from "@prisma/client";
import { BanIcon, Edit2Icon, SaveIcon, Trash2Icon, XIcon } from "lucide-react";
import { useState } from "react";
import { AssignmentDetailsSection } from "./details-section/AssignmentDetailsSection";
import { AssignmentSolutionSection } from "./solution-section/AssignmentSolutionSection";

type TAssignmentDetailsModalProps = {
  assignment: TClassroomAssignmentWithTeacher;
  onClose: () => void;
  onAssignmentRevoked: () => void;
  onAssignmentUpdated: (updatedAssignment: ClassroomAssignment) => void;
};

export function AssignmentDetailsModal({
  assignment,
  onClose,
  onAssignmentRevoked,
  onAssignmentUpdated,
}: TAssignmentDetailsModalProps) {
  // context
  const { profile } = useDashboardContext();

  // zuustand state and actions
  const numOfModalsOpen = useMiscStore((state) => state.numOfModalsOpen);

  // state
  const [editedAssignment, setEditedAssignment] = useState<TEditedAssignment>({
    title: assignment.title,
    description: assignment.description,
    dueDate: assignment.dueDate,
  });
  const [editedAssignmentErrors, setEditedAssignmentErrors] = useState<TEditedAssignment>({
    title: "",
    description: "",
    dueDate: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdateAssignmentPending, setIsUpdateAssignmentPending] = useState(false);
  const [isRevokeAssignmentPending, setIsRevokeAssignmentPending] = useState(false);

  // hooks
  const {
    data: assignmentResources,
    isLoading: isAssignmentResourcesLoading,
    refetch: refetchAssignmentResources,
  } = useClassroomAssignmentResources(assignment.id);

  const { toast } = useToast();
  const {
    isOpen: isRevokeAssignmentModalOpen,
    close: closeRevokeAssignmentModal,
    toggle: toggleRevokeAssignmentModal,
  } = useDisclosure();

  // handlers
  const handleRevokeAssignment = async () => {
    try {
      setIsRevokeAssignmentPending(true);

      const res = await removeClassroomAssignment({
        classroomAssignment: {
          assignmentId: assignment.id,
        },
      });

      toast({
        title: "Assignment revoked",
        description: "The assignment has been revoked successfully.",
        variant: "default",
      });

      onAssignmentRevoked();
    } catch (error) {
      toast({
        title: "Error revoking assignment",
        description:
          error instanceof Error ? error.message : "An error occurred while revoking the assignment.",
        variant: "destructive",
      });
    } finally {
      setIsRevokeAssignmentPending(false);
      closeRevokeAssignmentModal();
    }
  };

  const handleUpdateAssignment = async () => {
    const validationErrors = validateEditedClassroomAssignment(assignment, editedAssignment);

    if (Object.values(validationErrors).some((error) => error !== "")) {
      setEditedAssignmentErrors(validationErrors);
      return;
    }

    try {
      setIsUpdateAssignmentPending(true);

      const res = await updateClassroomAssignment({
        classroomAssignment: {
          id: assignment.id,
          title: editedAssignment.title,
          description: editedAssignment.description,
          dueDate: editedAssignment.dueDate,
        },
      });

      toast({
        title: "Assignment updated",
        description: "The assignment has been updated successfully.",
        variant: "default",
      });

      onAssignmentUpdated(res.classroomAssignment);
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Error updating assignment",
        description:
          error instanceof Error ? error.message : "An error occurred while updating the assignment.",
        variant: "destructive",
      });
    } finally {
      setIsUpdateAssignmentPending(false);
    }
  };

  return (
    <div
      className={`${numOfModalsOpen > 3 && "h-0 overflow-hidden"} mt-2 px-5 pb-4`}
      id="view-classroom-assignment-container"
    >
      <div className="flex justify-end">
        <Button
          className="rounded-full bg-slate-500/30 hover:bg-slate-600/30 dark:bg-slate-600/30 hover:dark:bg-slate-500/30"
          onClick={onClose}
          size={"icon"}
        >
          <XIcon size={24} className="text-slate-600 dark:text-slate-600" />
        </Button>
      </div>

      {/* Audit actions */}
      {profile.role === "TEACHER" && (
        <div className="flex gap-2 items-center mt-8 w-fit ml-auto">
          <div
            className={`${
              isEditing && "flex items-center gap-2 p-2 border-2 border-slate-800/75 rounded-lg"
            }`}
          >
            {/* Cancel editing button */}
            {isEditing && (
              <Button
                variant="secondary"
                className="px-5 text-base"
                onClick={() => {
                  setIsEditing(false);
                  setEditedAssignment({
                    title: assignment.title,
                    description: assignment.description,
                    dueDate: assignment.dueDate,
                  });
                }}
              >
                <BanIcon size={15} className="mr-3" />
                Cancel
              </Button>
            )}

            {/* Edit button */}
            <Button
              variant="default"
              className="px-5 text-base"
              onClick={() => {
                if (isEditing) handleUpdateAssignment();
                else setIsEditing(true);
              }}
            >
              {isEditing ? (
                <>
                  {isUpdateAssignmentPending ? (
                    <Spinner />
                  ) : (
                    <>
                      <SaveIcon size={15} className="mr-3" />
                      Save changes
                    </>
                  )}
                </>
              ) : (
                <>
                  <Edit2Icon size={15} className="mr-3" />
                  Edit
                </>
              )}
            </Button>
          </div>

          {/* Revoke button */}
          <AlertDialog open={isRevokeAssignmentModalOpen} onOpenChange={toggleRevokeAssignmentModal}>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="px-5 text-base">
                <Trash2Icon size={15} className="mr-3" />
                Revoke
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent className="sm:max-w-[425px]">
              <AlertDialogHeader>
                <AlertDialogTitle>Revoke assignment</AlertDialogTitle>

                <AlertDialogDescription>
                  Are you sure you want to revoke current assignment? All student submissions for current
                  assignment will be removed as well.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleRevokeAssignment}>
                  {isRevokeAssignmentPending ? <Spinner /> : "Revoke"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}

      {/* Assignment details */}
      <AssignmentDetailsSection
        assignment={assignment}
        assignmentResources={assignmentResources}
        isAssignmentResourcesLoading={isAssignmentResourcesLoading}
        editedAssignment={editedAssignment}
        setEditedAssignment={setEditedAssignment}
        editedAssignmentErrors={editedAssignmentErrors}
        isEditing={isEditing}
      />

      {/* Solution section */}
      <div className="bg-slate-900 px-7 py-5 mt-10 rounded-xl overflow-hidden">
        <h2 className="text-2xl font-medium mb-6">
          {profile.role === "STUDENT" ? "Upload your solution" : "Submitted solutions"}
        </h2>

        {profile.role === "STUDENT" ? (
          <AssignmentSolutionSection
            viewFor="student"
            assignmentId={assignment.id}
            classroomAssignment={assignment}
            onClose={onClose}
          />
        ) : (
          <AssignmentSolutionSection
            viewFor="teacher"
            assignmentId={assignment.id}
            classroomAssignment={assignment}
            onClose={onClose}
          />
        )}
      </div>
    </div>
  );
}
