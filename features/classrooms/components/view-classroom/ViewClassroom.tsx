import { Separator } from "@/components/ui/separator";
import { useDashboardStore } from "@/stores";
import { useEffect } from "react";
import { ClassroomContent, ClassroomContentHeader, ClassroomHeader, ClassroomSidebar } from ".";

type TViewClassroomProps = {
  toggleModal: () => void;
};

export function ViewClassroom({ toggleModal }: TViewClassroomProps) {
  // zustand state and actions
  const selectedClassroom = useDashboardStore((state) => state.selectedClassroom);

  useEffect(() => {
    if (!selectedClassroom) {
      toggleModal();
    }
  }, [selectedClassroom, toggleModal]);

  return (
    <div className="pr-2">
      <ClassroomHeader toggleModal={toggleModal} />

      <Separator className="my-4" />

      <div className="flex gap-4 mt-6">
        <ClassroomSidebar className="sticky left-0 top-4 max-w-52 w-1/4 h-full mt-14 py-3 px-2" />

        <div className="flex-1">
          <ClassroomContentHeader className="sticky top-5" />
          <ClassroomContent className="mt-7" />
        </div>
      </div>
    </div>
  );
}