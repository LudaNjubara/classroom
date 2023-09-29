import { DataTable } from "@/components/common/table/data-table";
import { teacherTableColumns } from "@/components/common/table/teacher-columns";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useDashboardStore } from "@/lib/store/DashboardStore";
import { PlusCircle } from "lucide-react";
import { useState } from "react";

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
            Add Teacher
          </Button>
        </div>

        <Separator className="my-4" />

        <div className="mt-8">
          <DataTable columns={teacherTableColumns} data={selectedOrganization?.teachers ?? []} />
        </div>
      </div>

      {isAddTeacherModalOpen && (
        <div className="absolute inset-0 p-4 bg-slate-950 animate-pop-up transform-gpu">
          <h2 className="text-2xl font-medium">Add Teacher</h2>
          <p className="text-slate-600">Add a new teacher to your organization</p>

          <div className="flex items-center justify-end mt-4">
            <Button variant="outline" onClick={() => setIsAddTeacherModalOpen(false)}>
              Cancel
            </Button>
            <Button className="ml-2">Add Teacher</Button>
          </div>
        </div>
      )}
    </div>
  );
}
