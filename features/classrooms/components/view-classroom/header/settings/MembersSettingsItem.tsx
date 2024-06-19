import { DataTable } from "@/components/Elements";
import { useToast } from "@/components/ui/use-toast";
import { useClassroomStudents } from "@/features/classrooms/hooks/useClassroomStudents";
import { useClassroomTeachers } from "@/features/classrooms/hooks/useClassroomTeachers";
import { studentTableColumns } from "@/features/students";
import { teacherTableColumns } from "@/features/teachers";
import { useDashboardStore } from "@/stores";
import { useState } from "react";

export function MembersSettingsItem() {
  // zustand state and actions
  const selectedOrganization = useDashboardStore((state) => state.selectedOrganization);
  const selectedClassroom = useDashboardStore((state) => state.selectedClassroom);

  // state
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);

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
  const { toast } = useToast();

  // handlers

  return (
    <div>
      <div className="mt-4">
        <h2 className="text-xl font-medium">Teachers</h2>
        <DataTable columns={teacherTableColumns} data={classroomTeachers ?? []} />
      </div>

      <div className="mt-4">
        <h2 className="text-xl font-medium">Students</h2>
        <DataTable columns={studentTableColumns} data={classroomStudents ?? []} />
      </div>
    </div>
  );
}
