"use client";

import { Separator } from "@/components/ui/separator";
import { Tabs } from "@/components/ui/tabs";
import { useDashboardStore } from "@/stores";
import { useEffect } from "react";
import { ClassroomContentHeader } from "./content-header/ClassroomContentHeader";
import { ClassroomContent } from "./content/ClassroomContent";
import { ClassroomHeader } from "./header/ClassroomHeader";
import { ClassroomSidebar } from "./sidebar/ClassroomSidebar";

type TViewClassroomProps = {
  toggleModal: () => void;
};

export function ViewClassroom({ toggleModal }: TViewClassroomProps) {
  // zustand state and actions
  const setSelectedChannel = useDashboardStore((state) => state.setSelectedChannel);
  const selectedClassroom = useDashboardStore((state) => state.selectedClassroom);

  useEffect(() => {
    if (!selectedClassroom) {
      toggleModal();
    }

    return () => {
      setSelectedChannel(null);
    };
  }, [selectedClassroom, toggleModal, setSelectedChannel]);

  return (
    <div className="pr-2">
      <ClassroomHeader toggleModal={toggleModal} />

      <Separator className="my-4" />

      <div className="flex gap-4 mt-6">
        <ClassroomSidebar className="sticky left-0 top-4 max-w-52 w-1/4 h-full mt-14 py-3 px-2" />

        <div className="flex-1">
          <Tabs defaultValue="posts" className="w-full">
            <ClassroomContentHeader className="sticky top-5" />
            <ClassroomContent className="mt-7" />
          </Tabs>
        </div>
      </div>
    </div>
  );
}
