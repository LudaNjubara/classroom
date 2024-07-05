import { CustomModal, DataTable } from "@/components/Elements";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useDashboardContext } from "@/context";
import { removeClassroomStudent } from "@/features/classrooms/api/remove-classroom-student";
import { removeClassroomTeacher } from "@/features/classrooms/api/remove-classroom-teacher";
import { useClassroomStudents, useClassroomTeachers } from "@/features/classrooms/hooks";
import useStudentColumns from "@/features/students/hooks/useStudentColumns";
import useTeacherColumns from "@/features/teachers/hooks/useTeacherColumns";
import { useDisclosure } from "@/hooks/useDisclosure";
import { useDashboardStore } from "@/stores";
import { PlusCircleIcon } from "lucide-react";
import { createPortal } from "react-dom";
import { AddClassroomStudentModal, AddClassroomTeacherModal } from ".";

export function MembersSettingsItem() {
  // context
  const { profile } = useDashboardContext();

  // zustand state and actions
  const selectedClassroom = useDashboardStore((state) => state.selectedClassroom);

  // hooks
  const {
    data: classroomTeachers,
    isLoading: isClassroomTeachersLoading,
    refetch: refetchClassroomTeachers,
  } = useClassroomTeachers(selectedClassroom?.id);
  const {
    data: classroomStudents,
    isLoading: isClassroomStudentsLoading,
    refetch: refetchClassroomStudents,
  } = useClassroomStudents(selectedClassroom?.id);

  const { isOpen: isAddTeachersModalOpen, toggle: toggleAddTeachersModal } = useDisclosure();
  const { isOpen: isAddStudentsModalOpen, toggle: toggleAddStudentsModal } = useDisclosure();

  const studentTableColumns = useStudentColumns({ onRemoveStudent: handleRemoveStudent });
  const teacherTableColumns = useTeacherColumns({ onRemoveTeacher: handleRemoveTeacher });

  const { toast } = useToast();

  // handlers
  async function handleRemoveStudent(studentId: string) {
    if (!selectedClassroom) return;

    try {
      const res = await removeClassroomStudent({
        classroomStudent: {
          classroomId: selectedClassroom.id,
          studentId,
        },
      });

      toast({
        title: res.message,
        variant: "default",
      });

      refetchClassroomStudents();
    } catch (error) {
      console.error(error);

      toast({
        title: "An error occurred while removing the student",
        variant: "destructive",
      });
    }
  }

  async function handleRemoveTeacher(teacherId: string) {
    if (!selectedClassroom) return;

    try {
      const res = await removeClassroomTeacher({
        classroomTeacher: {
          classroomId: selectedClassroom.id,
          teacherId,
        },
      });

      toast({
        title: res.message,
        variant: "default",
      });

      refetchClassroomTeachers();
    } catch (error) {
      console.error(error);

      toast({
        title: "Teacher removal failed",
        description: error instanceof Error ? error.message : "An error occurred while removing the teacher",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="pb-8">
      <div className="mt-4 p-4 rounded-lg dark:bg-slate-900 bg-slate-100">
        <h2 className="text-xl font-medium">Teachers</h2>

        {profile.role !== "STUDENT" && (
          <div className="flex items-center justify-end mt-6 mb-14">
            <Button className="flex gap-2" variant={"secondary"} onClick={toggleAddTeachersModal}>
              <PlusCircleIcon size={18} className="opacity-80" />
              Add Teacher&#40;s&#41;
            </Button>
          </div>
        )}

        <DataTable columns={teacherTableColumns} data={classroomTeachers ?? []} />
      </div>

      <div className="mt-4 p-4 rounded-lg dark:bg-slate-900 bg-slate-100">
        <h2 className="text-xl font-medium">Students</h2>

        {profile.role !== "STUDENT" && (
          <div className="flex items-center justify-end mt-6 mb-14">
            <Button className="flex gap-2" variant={"secondary"} onClick={toggleAddStudentsModal}>
              <PlusCircleIcon size={18} className="opacity-80" />
              Add Student&#40;s&#41;
            </Button>
          </div>
        )}

        <DataTable columns={studentTableColumns} data={classroomStudents ?? []} />
      </div>

      {/* Add teachers modal */}
      {isAddTeachersModalOpen &&
        createPortal(
          <CustomModal>
            <AddClassroomTeacherModal
              onSuccess={() => {
                refetchClassroomTeachers();
                toggleAddTeachersModal();
              }}
              toggleOpen={toggleAddTeachersModal}
            />
          </CustomModal>,
          document.getElementById("classroom-settings-container")!
        )}

      {/* Add students modal */}
      {isAddStudentsModalOpen &&
        createPortal(
          <CustomModal>
            <AddClassroomStudentModal
              onSuccess={() => {
                refetchClassroomStudents();
                toggleAddStudentsModal();
              }}
              toggleOpen={toggleAddStudentsModal}
            />
          </CustomModal>,
          document.getElementById("classroom-settings-container")!
        )}
    </div>
  );
}
