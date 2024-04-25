import { CustomPagination, GridView, SearchBox } from "@/components/Elements";
import { TeacherCardSkeleton } from "@/components/Loaders";
import { useStudents } from "@/features/students/hooks/useStudents";
import { TSelectedTeacherItem, TTeacherWithProfile, TTeachersFetchFilterParams } from "@/features/teachers";
import { TeacherCard } from "@/features/teachers/components/TeacherCard";
import { cn } from "@/utils/cn";
import { memo, useCallback, useState } from "react";

type TTeachersFormFieldProps = {
  selectedTeacherItems: TSelectedTeacherItem[];
  setSelectedTeacherItems: React.Dispatch<React.SetStateAction<TSelectedTeacherItem[]>>;
  className?: string;
};

export const TeachersFormField = memo(
  ({ selectedTeacherItems, setSelectedTeacherItems, className }: TTeachersFormFieldProps) => {
    // state
    const [filterParams, setFilterParams] = useState<TTeachersFetchFilterParams>();

    // hooks
    const { data: paginatedTeachers, isLoading: isTeachersLoading } = useStudents(filterParams);

    // handlers
    const handleSelectTeacher = useCallback(
      (teacher: TTeacherWithProfile, inviteMessage?: string) => {
        let teacherItemsToStore: TSelectedTeacherItem[] = [];

        if (selectedTeacherItems.some((item) => item.teacherId === teacher.id)) {
          if (inviteMessage) {
            // Update the inviteMessage for the teacher
            teacherItemsToStore = selectedTeacherItems.map((item) =>
              item.teacherId === teacher.id ? { ...item, inviteMessage } : item
            );
          } else {
            // Remove the teacher from the selected teachers
            teacherItemsToStore = selectedTeacherItems.filter((item) => item.teacherId !== teacher.id);
          }
        } else {
          teacherItemsToStore = [...selectedTeacherItems, { teacherId: teacher.id, inviteMessage }];
        }

        setSelectedTeacherItems(teacherItemsToStore);
      },
      [selectedTeacherItems, setSelectedTeacherItems]
    );

    return (
      <div className={`${cn("", className)}`}>
        <h5 className="text-sm font-medium">Teachers</h5>
        <p className="text-sm text-muted-foreground">
          Here you can search for teachers to add to this classroom.
        </p>

        <SearchBox
          searchingFor="teachers"
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
          {isTeachersLoading && (
            <GridView>
              {[...Array(5)].map((_, index) => (
                <TeacherCardSkeleton key={index} />
              ))}
            </GridView>
          )}

          {!isTeachersLoading && !!paginatedTeachers.data.length && (
            <GridView>
              {paginatedTeachers.data.map((teacher) => {
                return (
                  <TeacherCard key={teacher.id} teacher={teacher} handleSelectTeacher={handleSelectTeacher} />
                );
              })}
            </GridView>
          )}

          {!isTeachersLoading && !paginatedTeachers.data.length && (
            <p className=" text-slate-600 py-5 text-center">No teachers found</p>
          )}
        </div>

        <CustomPagination
          count={paginatedTeachers.count || 0}
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
TeachersFormField.displayName = "TeachersFormField";
