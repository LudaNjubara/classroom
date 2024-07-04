import { CustomPagination, GridView, SearchBox } from "@/components/Elements";
import { TeacherCardSkeleton } from "@/components/Loaders";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { updateClassroom } from "@/features/classrooms/api";
import { TStudentsFetchFilterParams, useStudents } from "@/features/students";
import { StudentCard } from "@/features/students/components/StudentCard";
import { useDashboardStore } from "@/stores";
import { useEffect, useState } from "react";

type TAddClassroomStudentModalProps = {
  toggleOpen: () => void;
};

export function AddClassroomStudentModal({ toggleOpen }: TAddClassroomStudentModalProps) {
  // zustand state and actions
  const selectedClassroom = useDashboardStore((state) => state.selectedClassroom);
  const accentColors = useDashboardStore((state) => state.accentColors);
  const selectedStudentItems = useDashboardStore((state) => state.selectedStudentItems);
  const setSelectedStudentItems = useDashboardStore((state) => state.setSelectedStudentItems);

  // state
  const [filterParams, setFilterParams] = useState<TStudentsFetchFilterParams>();

  // hooks
  const { data: paginatedStudents, isLoading: isStudentsLoading } = useStudents(filterParams);
  const { toast } = useToast();

  // handlers
  const handleSelectStudent = (student: any) => {
    let studentItemsToStore: any[] = [];

    if (selectedStudentItems.some((item) => item.studentId === student.id)) {
      studentItemsToStore = selectedStudentItems.filter((item) => item.studentId !== student.id);
    } else {
      studentItemsToStore = [...selectedStudentItems, { studentId: student.id }];
    }

    setSelectedStudentItems(studentItemsToStore);
  };

  const handleAddStudents = async () => {
    if (!selectedStudentItems.length) return;

    await updateClassroom({
      classroomStudents: {
        students: selectedStudentItems.map((item) => item.studentId),
        classroomId: selectedClassroom!.id,
      },
    });

    toast({
      title: "Students added successfully",
      description:
        "Selected students have been added to the classroom. You can view them in the members tab.",
      variant: "default",
    });
  };

  useEffect(() => {
    return () => {
      setSelectedStudentItems([]);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <h2 className="text-2xl font-medium">
        Add students to{" "}
        <span style={{ color: accentColors[selectedClassroom!.id].base }}>{selectedClassroom?.name}</span>
      </h2>

      <p className="text-slate-600">
        Add students to the current classroom. Search for students and select them to add to the classroom.
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
