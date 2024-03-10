import { DataTable } from "@/components/Elements/table/DataTable";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useDashboardStore } from "@/stores/dashboard/DashboardStore";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { studentTableColumns } from "./student-columns";

export function StudentsTab() {
  // zustand state and actions
  const selectedOrganization = useDashboardStore((state) => state.selectedOrganization);

  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);

  return (
    <div>
      <div>
        <h2 className="text-2xl font-medium">Students</h2>
        <p className="text-slate-600">View and manage your students here</p>

        <div className="flex items-center justify-end mt-2">
          <Button className="flex gap-2 mt-4" onClick={() => setIsAddStudentModalOpen(true)}>
            <PlusCircle size={18} className="opacity-80" />
            Add Student
          </Button>
        </div>

        <Separator className="my-4" />

        <div className="mt-8">
          <DataTable columns={studentTableColumns} data={selectedOrganization?.students ?? []} />
        </div>
      </div>

      {isAddStudentModalOpen && (
        <div className="absolute inset-0 p-4 bg-slate-300 dark:bg-slate-950 animate-pop-up transform-gpu">
          <h2 className="text-2xl font-medium">Add Student</h2>
          <p className="text-slate-600">Add a new student to your organization</p>

          <div className="flex items-center justify-end mt-4">
            <Button variant="outline" onClick={() => setIsAddStudentModalOpen(false)}>
              Cancel
            </Button>
            <Button className="ml-2">Add Student</Button>
          </div>
        </div>
      )}
    </div>
  );
}
