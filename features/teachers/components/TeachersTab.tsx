"use client";

import { CustomModal } from "@/components/Elements";
import { DataTable } from "@/components/Elements/table/DataTable";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useDisclosure } from "@/hooks/useDisclosure";
import { useDashboardStore } from "@/stores/dashboard/DashboardStore";
import { PlusCircle } from "lucide-react";
import { AddTeacherModal } from "./AddTeacherModal";
import { teacherTableColumns } from "./teacher-columns";

export function TeachersTab() {
  // zustand state and actions
  const selectedOrganization = useDashboardStore((state) => state.selectedOrganization);

  // hooks
  const { isOpen: isModalOpen, toggle: toggleModal } = useDisclosure();

  return (
    <div>
      <div>
        <h2 className="text-2xl font-medium">Teachers</h2>
        <p className="text-slate-600">View and manage your teachers here</p>

        <Separator className="my-4" />

        <div className="flex items-center justify-end mt-6 mb-14">
          <Button className="flex gap-2" variant={"secondary"} onClick={toggleModal}>
            <PlusCircle size={18} className="opacity-80" />
            Add Teacher&#40;s&#41;
          </Button>
        </div>

        <div className="mt-4">
          <DataTable columns={teacherTableColumns} data={selectedOrganization?.teachers ?? []} />
        </div>
      </div>

      {isModalOpen && (
        <CustomModal>
          <AddTeacherModal toggleOpen={toggleModal} />
        </CustomModal>
      )}
    </div>
  );
}
