import { GridView } from "@/components/Elements/";
import { TeacherCardSkeleton } from "@/components/Loaders";
import { Button } from "@/components/ui/button";
import { TTeacherWithProfile, TTeachersFetchFilterParams } from "@/types/typings";
import { useState } from "react";
import { useTeachers } from "../hooks/useTeachers";
import { TSelectedTeacherItem } from "../types";
import { SearchBox } from "./SearchBox";
import { TeacherCard } from "./TeacherCard";

type TAddTeacherModalProps = {
  toggleOpen: () => void;
};

export function AddTeacherModal({ toggleOpen }: TAddTeacherModalProps) {
  const [filterParams, setFilterParams] = useState<TTeachersFetchFilterParams>();
  const [selectedTeacherItems, setSelectedTeacherItems] = useState<TSelectedTeacherItem[]>([]);

  // hooks
  const { data: teachers, isLoading: isTeachersLoading } = useTeachers(filterParams);

  const handleSelectTeacher = (teacher: TTeacherWithProfile, customInviteMessage?: string) => {
    setSelectedTeacherItems((prev) => {
      if (prev.some((item) => item.teacherId === teacher.id)) {
        return prev.map((item) => (item.teacherId === teacher.id ? { ...item, customInviteMessage } : item));
      }

      return [...prev, { teacherId: teacher.id, customInviteMessage }];
    });
  };

  const handleAddTeachers = () => {
    // Add teachers to the organization

    console.log("Selected Teachers", selectedTeacherItems);
  };

  return (
    <div className="absolute inset-0 p-4 bg-slate-300 dark:bg-slate-950 animate-pop-up transform-gpu">
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

          {!isTeachersLoading && !!teachers.length ? (
            <GridView>
              {teachers.map((teacher) => (
                <TeacherCard
                  key={teacher.id}
                  teacher={teacher}
                  isSelected={selectedTeacherItems.some((item) => item.teacherId === teacher.id)}
                  handleSelectTeacher={handleSelectTeacher}
                />
              ))}
            </GridView>
          ) : (
            <p className=" text-slate-600 py-5 text-center">No teachers found</p>
          )}
        </div>
      </div>

      <div className="sticky bottom-0 left-0 right-0 p-4 pb-0 flex items-center justify-end bg-slate-300 dark:bg-slate-950">
        <Button variant="outline" onClick={toggleOpen}>
          Cancel
        </Button>
        <Button className="ml-2" onClick={handleAddTeachers}>
          Add Teacher(s)
        </Button>
      </div>
    </div>
  );
}
