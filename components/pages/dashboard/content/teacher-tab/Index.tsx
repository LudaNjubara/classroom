import { DataTable } from "@/components/common/table/data-table";
import { teacherTableColumns } from "@/components/common/table/teacher-columns";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useDashboardStore } from "@/lib/store/DashboardStore";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import AddTeacherModal from "./AddTeacherModal";

export default function TeachersTab() {
  // zustand state and actions
  const selectedOrganization = useDashboardStore((state) => state.selectedOrganization);

  const [isAddTeacherModalOpen, setIsAddTeacherModalOpen] = useState(false);

  return (
    <div>
      <div>
        <h2 className="text-2xl font-medium">Teachers</h2>
        <p className="text-slate-600">View and manage your teachers here</p>

        <div className="flex items-center justify-end mt-2">
          <Button className="flex gap-2 mt-4" onClick={() => setIsAddTeacherModalOpen(true)}>
            <PlusCircle size={18} className="opacity-80" />
            Add Teacher(s)
          </Button>
        </div>

        <Separator className="my-4" />

        <div className="mt-8">
          <DataTable columns={teacherTableColumns} data={selectedOrganization?.teachers ?? []} />
        </div>
      </div>

      {isAddTeacherModalOpen && <AddTeacherModal setIsAddTeacherModalOpen={setIsAddTeacherModalOpen} />}
    </div>
  );
}
