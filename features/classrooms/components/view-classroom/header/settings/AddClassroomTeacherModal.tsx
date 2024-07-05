import { CustomPagination, GridView, SearchBox } from "@/components/Elements";
import { TeacherCardSkeleton } from "@/components/Loaders";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { updateClassroom } from "@/features/classrooms/api";
import { TTeachersFetchFilterParams, useTeachers } from "@/features/teachers";
import { TeacherCard } from "@/features/teachers/components/TeacherCard";
import { useDashboardStore } from "@/stores";
import { useEffect, useState } from "react";

type TAddClassroomTeacherModalProps = {
  onSuccess: () => void;
  toggleOpen: () => void;
};

export function AddClassroomTeacherModal({ onSuccess, toggleOpen }: TAddClassroomTeacherModalProps) {
  // zustand state and actions
  const selectedOrganization = useDashboardStore((state) => state.selectedOrganization);
  const selectedClassroom = useDashboardStore((state) => state.selectedClassroom);
  const accentColors = useDashboardStore((state) => state.accentColors);
  const selectedTeacherItems = useDashboardStore((state) => state.selectedTeacherItems);
  const setSelectedTeacherItems = useDashboardStore((state) => state.setSelectedTeacherItems);

  // state
  const [filterParams, setFilterParams] = useState<TTeachersFetchFilterParams>();

  // hooks
  const { data: paginatedTeachers, isLoading: isTeachersLoading } = useTeachers(
    filterParams,
    selectedOrganization?.id
  );
  const { toast } = useToast();

  // handlers
  const handleSelectTeacher = (teacher: any) => {
    let teacherItemsToStore: any[] = [];

    if (selectedTeacherItems.some((item) => item.teacherId === teacher.id)) {
      teacherItemsToStore = selectedTeacherItems.filter((item) => item.teacherId !== teacher.id);
    } else {
      teacherItemsToStore = [...selectedTeacherItems, { teacherId: teacher.id }];
    }

    setSelectedTeacherItems(teacherItemsToStore);
  };

  const handleAddTeachers = async () => {
    if (!selectedTeacherItems.length) return;

    await updateClassroom({
      classroomTeachers: {
        teachers: selectedTeacherItems.map((item) => item.teacherId),
        classroomId: selectedClassroom!.id,
      },
    });

    toast({
      title: "Teachers added successfully",
      description:
        "Selected teachers have been added to the classroom. You can view them in the members tab.",
      variant: "default",
    });

    onSuccess();
  };

  useEffect(() => {
    return () => {
      setSelectedTeacherItems([]);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <h2 className="text-2xl font-medium">
        Add teachers to{" "}
        <span style={{ color: accentColors[selectedClassroom!.id].base }}>{selectedClassroom?.name}</span>
      </h2>

      <p className="text-slate-600">
        Add teachers to the current classroom. Search for teachers and select them to add to the classroom.
      </p>

      <div className="flex flex-col gap-5 mt-4">
        <SearchBox
          searchingFor="teachers"
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

      <div className="sticky bottom-0 left-0 right-0 p-4 pb-0 flex items-center justify-end bg-slate-300 dark:bg-slate-950">
        <Button variant="outline" onClick={toggleOpen}>
          Cancel
        </Button>
        <Button className="ml-2" onClick={handleAddTeachers} disabled={selectedTeacherItems.length === 0}>
          Add Teacher(s)
        </Button>
      </div>
    </>
  );
}
