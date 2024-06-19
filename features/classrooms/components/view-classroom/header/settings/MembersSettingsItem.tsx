import { CustomModal, DataTable } from "@/components/Elements";
import { Button } from "@/components/ui/button";
import { useDashboardContext } from "@/context";
import { useClassroomStudents, useClassroomTeachers } from "@/features/classrooms/hooks";
import { studentTableColumns } from "@/features/students";
import { teacherTableColumns } from "@/features/teachers";
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
            <AddClassroomTeacherModal toggleOpen={toggleAddTeachersModal} />
          </CustomModal>,
          document.getElementById("classroom-settings-container")!
        )}

      {/* Add students modal */}
      {isAddStudentsModalOpen &&
        createPortal(
          <CustomModal>
            <AddClassroomStudentModal toggleOpen={toggleAddStudentsModal} />
          </CustomModal>,
          document.getElementById("classroom-settings-container")!
        )}
    </div>
  );
}
