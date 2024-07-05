import { CustomPagination, GridView, SearchBox } from "@/components/Elements";
import { TeacherCardSkeleton } from "@/components/Loaders";
import { TSelectedStudentItem, TStudentWithProfile, TStudentsFetchFilterParams } from "@/features/students";
import { StudentCard } from "@/features/students/components/StudentCard";
import { useStudents } from "@/features/students/hooks/useStudents";
import { useDashboardStore } from "@/stores";
import { cn } from "@/utils/cn";
import { memo, useCallback, useState } from "react";

type TStudentsFormFieldProps = {
  selectedStudentItems: TSelectedStudentItem[];
  setSelectedStudentItems: React.Dispatch<React.SetStateAction<TSelectedStudentItem[]>>;
  className?: string;
};

export const StudentsFormField = memo(
  ({ selectedStudentItems, setSelectedStudentItems, className }: TStudentsFormFieldProps) => {
    // zustand state and actions
    const selectedOrganization = useDashboardStore((state) => state.selectedOrganization);

    // state
    const [filterParams, setFilterParams] = useState<TStudentsFetchFilterParams>();

    // hooks
    const { data: paginatedStudents, isLoading: isStudentsLoading } = useStudents(
      filterParams,
      selectedOrganization?.id
    );

    // handlers
    const handleSelectStudent = useCallback(
      (student: TStudentWithProfile, inviteMessage?: string) => {
        let studentItemsToStore: TSelectedStudentItem[] = [];

        if (selectedStudentItems.some((item) => item.studentId === student.id)) {
          if (inviteMessage) {
            // Update the inviteMessage for the student
            studentItemsToStore = selectedStudentItems.map((item) =>
              item.studentId === student.id ? { ...item, inviteMessage } : item
            );
          } else {
            // Remove the student from the selected students
            studentItemsToStore = selectedStudentItems.filter((item) => item.studentId !== student.id);
          }
        } else {
          studentItemsToStore = [...selectedStudentItems, { studentId: student.id, inviteMessage }];
        }

        setSelectedStudentItems(studentItemsToStore);
      },
      [selectedStudentItems, setSelectedStudentItems]
    );

    return (
      <div className={`${cn("", className)}`}>
        <h5 className="text-sm font-medium">Students</h5>
        <p className="text-sm text-muted-foreground">
          Here you can search for students to add to this classroom.
        </p>

        <SearchBox
          searchingFor="students"
          searchFields={{
            name: "Name",
            email: "Email",
            address: "Address",
            city: "City",
            country: "Country",
            phone: "Phone",
            state: "State",
          }}
          setFilterParams={setFilterParams}
          className="mt-4"
        />

        <div className="flex-1 mt-4 overflow-y-auto pb-8">
          {isStudentsLoading && (
            <GridView>
              {[...Array(5)].map((_, index) => (
                <TeacherCardSkeleton key={index} />
              ))}
            </GridView>
          )}

          {!isStudentsLoading && !!paginatedStudents.data.length && (
            <GridView>
              {paginatedStudents.data.map((student) => {
                return (
                  <StudentCard key={student.id} student={student} handleSelectStudent={handleSelectStudent} />
                );
              })}
            </GridView>
          )}

          {!isStudentsLoading && !paginatedStudents.data.length && (
            <p className=" text-slate-600 py-5 text-center">No students found</p>
          )}
        </div>

        <CustomPagination
          count={paginatedStudents.count || 0}
          page={(filterParams?.from && (filterParams.from % 10) + 1) || 1}
          rowsPerPage={filterParams?.take || 10}
          onChangePage={(page) => setFilterParams((prev) => ({ ...prev, from: page }))}
          onChangeNumOfItemsPerPage={(numOfItems) =>
            setFilterParams((prev) => ({ ...prev, from: 0, take: numOfItems }))
          }
        />
      </div>
    );
  }
);
StudentsFormField.displayName = "StudentsFormField";
