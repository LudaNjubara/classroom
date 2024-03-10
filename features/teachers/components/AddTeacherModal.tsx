import { GridView } from "@/components/Elements/";
import { TeacherCardSkeleton } from "@/components/Loaders";
import { Button } from "@/components/ui/button";
import { TTeachersFetchFilterParams } from "@/types/typings";
import { Dispatch, SetStateAction, useState } from "react";
import { useTeachers } from "../hooks/useTeachers";
import SearchBox from "./SearchBox";
import TeacherCard from "./TeacherCard";

type TAddTeacherModalProps = {
  setIsAddTeacherModalOpen: Dispatch<SetStateAction<boolean>>;
};

function AddTeacherModal({ setIsAddTeacherModalOpen }: TAddTeacherModalProps) {
  const [filterParams, setFilterParams] = useState<TTeachersFetchFilterParams>();
  const { data: teachers, isLoading: isTeachersLoading } = useTeachers(filterParams);

  console.log("filterParams", filterParams);

  const handleAddTeachers = () => {
    // Add teachers to the organization
  };

  return (
    <div className="absolute inset-0 p-4 bg-slate-300 dark:bg-slate-950 animate-pop-up transform-gpu">
      <h2 className="text-2xl font-medium">Add Teacher</h2>
      <p className="text-slate-600">Add a new teacher to your organization</p>

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

          {!!teachers.length ? (
            <GridView>
              {teachers.map((teacher) => (
                <TeacherCard key={teacher.id} teacher={teacher} />
              ))}
            </GridView>
          ) : (
            <p className=" text-slate-600 py-5 text-center">No teachers found</p>
          )}
        </div>
      </div>

      <div className="sticky bottom-0 left-0 right-0 p-4 pb-0 flex items-center justify-end bg-slate-300 dark:bg-slate-950">
        <Button variant="outline" onClick={() => setIsAddTeacherModalOpen(false)}>
          Cancel
        </Button>
        <Button className="ml-2" onClick={handleAddTeachers}>
          Add Teacher(s)
        </Button>
      </div>
    </div>
  );
}

export default AddTeacherModal;
