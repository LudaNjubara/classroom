import GridView from "@/components/common/ui/GridView";
import { Button } from "@/components/ui/button";
import fetchTeachers from "@/lib/fetchers/fetch-teachers";
import { TTeacherWithProfile, TTeachersFetchFilterParams } from "@/types/typings";
import FocusTrap from "focus-trap-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import SearchBox from "./SearchBox";
import TeacherCard from "./TeacherCard";

type TAddTeacherModalProps = {
  setIsAddTeacherModalOpen: Dispatch<SetStateAction<boolean>>;
};

function AddTeacherModal({ setIsAddTeacherModalOpen }: TAddTeacherModalProps) {
  const [teachers, setTeachers] = useState<TTeacherWithProfile[]>([]);

  const handleAddTeachers = () => {
    setIsAddTeacherModalOpen(false);
  };

  useEffect(() => {
    const getTeachers = async () => {
      const filterParams: TTeachersFetchFilterParams = {
        orderBy: "name",
      };
      const teachers = await fetchTeachers(filterParams);
      setTeachers(teachers);
    };

    getTeachers();
  }, []);

  return (
    <FocusTrap>
      <div className="absolute inset-0 p-4 bg-slate-300 dark:bg-slate-950 animate-pop-up transform-gpu">
        <h2 className="text-2xl font-medium">Add Teacher</h2>
        <p className="text-slate-600">Add a new teacher to your organization</p>

        <div className="flex flex-col gap-5 mt-4">
          <SearchBox />

          <div className="flex-1 mt-4">
            {teachers.length > 0 ? (
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

        <div className="absolute bottom-0 left-0 right-0 p-4 flex items-center justify-end mt-4">
          <Button variant="outline" onClick={() => setIsAddTeacherModalOpen(false)}>
            Cancel
          </Button>
          <Button className="ml-2" onClick={handleAddTeachers}>
            Add Teacher(s)
          </Button>
        </div>
      </div>
    </FocusTrap>
  );
}

export default AddTeacherModal;
