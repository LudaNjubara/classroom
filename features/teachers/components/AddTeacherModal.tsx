import { GridView } from "@/components/Elements/";
import CustomPagination from "@/components/Elements/pagination/CustomPagination";
import { TeacherCardSkeleton } from "@/components/Loaders";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useDashboardStore } from "@/stores";
import { TTeacherWithProfile, TTeachersFetchFilterParams } from "@/types/typings";
import { useCallback, useEffect, useState } from "react";
import { inviteTeachers } from "../api/invite-teachers";
import { useTeachers } from "../hooks/useTeachers";
import { TSelectedTeacherItem } from "../types";
import { SearchBox } from "./SearchBox";
import { TeacherCard } from "./TeacherCard";

type TAddTeacherModalProps = {
  toggleOpen: () => void;
};

export function AddTeacherModal({ toggleOpen }: TAddTeacherModalProps) {
  // zustand state and actions
  const selectedTeacherItems = useDashboardStore((state) => state.selectedTeacherItems);
  const setSelectedTeacherItems = useDashboardStore((state) => state.setSelectedTeacherItems);

  // state
  const [filterParams, setFilterParams] = useState<TTeachersFetchFilterParams>();

  // hooks
  const { data: paginatedTeachers, isLoading: isTeachersLoading } = useTeachers(filterParams);

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

  const handleAddTeachers = async () => {
    await inviteTeachers(selectedTeacherItems);

    toast({
      title: "Teachers invited successfully",
      description:
        "Invitations have been sent to the selected teachers. You can view the status in the notifications tab.",
      variant: "default",
    });
  };

  useEffect(() => {
    return () => {
      setSelectedTeacherItems([]);
    };
  }, []);

  return (
    <>
      <h2 className="text-2xl font-medium">Add Teacher</h2>
      <p className="text-slate-600">
        Add new teachers to your organization. Search and select people you want to invite.
      </p>

      <div className="flex flex-col gap-5 mt-4">
        <SearchBox setFilterParams={setFilterParams} />

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
        <Button className="ml-2" onClick={handleAddTeachers}>
          Add Teacher(s)
        </Button>
      </div>
    </>
  );
}
