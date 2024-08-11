import { CustomPagination, GridView, SearchBox } from "@/components/Elements/";
import { TeacherCardSkeleton } from "@/components/Loaders";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useDashboardStore } from "@/stores";
import { useCallback, useEffect, useState } from "react";
import { inviteStudents } from "../api/invite-students";
import { useStudents } from "../hooks/useStudents";
import { TSelectedStudentItem, TStudentWithProfile, TStudentsFetchFilterParams } from "../types";
import { StudentCard } from "./StudentCard";

type TAddStudentModalProps = {
  toggleOpen: () => void;
};

export function AddStudentModal({ toggleOpen }: TAddStudentModalProps) {
  // zustand state and actions
  const selectedStudentItems = useDashboardStore((state) => state.selectedStudentItems);
  const setSelectedStudentItems = useDashboardStore((state) => state.setSelectedStudentItems);

  // state
  const [filterParams, setFilterParams] = useState<TStudentsFetchFilterParams>();

  // hooks
  const { data: paginatedStudents, isLoading: isStudentsLoading } = useStudents(filterParams);

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

  const handleAddStudents = async () => {
    if (!selectedStudentItems.length) return;

    await inviteStudents(selectedStudentItems);

    toast({
      title: "Students invited successfully",
      description:
        "Invitations have been sent to the selected students. You can view the status in the notifications tab.",
      variant: "default",
    });

    toggleOpen();
  };

  useEffect(() => {
    return () => {
      setSelectedStudentItems([]);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <h2 className="text-2xl font-medium">Add Student</h2>
      <p className="text-slate-600">
        Add new students to your organization. Search and select people you want to invite.
      </p>

      <div className="flex flex-col gap-5 mt-4">
        <SearchBox
          searchingFor="students"
          searchFields={{
            name: "Name",
            email: "Email",
            address: "Address",
            city: "City",
            state: "State",
            phone: "Phone",
            country: "Country",
          }}
          setFilterParams={setFilterParams}
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

      <div className="sticky bottom-0 left-0 right-0 p-4 pb-0 flex items-center justify-end bg-slate-300 dark:bg-slate-950">
        <Button variant="outline" onClick={toggleOpen}>
          Cancel
        </Button>
        <Button className="ml-2" onClick={handleAddStudents} disabled={selectedStudentItems.length === 0}>
          Add Student(s)
        </Button>
      </div>
    </>
  );
}
