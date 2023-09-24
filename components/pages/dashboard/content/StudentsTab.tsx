import { useDashboardStore } from "@/lib/store/DashboardStore";

export default function StudentsTab() {
  const selectedOrganization = useDashboardStore((state) => state.selectedOrganization);

  return (
    <div>
      <div>
        <h2 className="text-2xl font-medium">Students</h2>
        <p className="text-slate-600">View and manage your students here</p>
      </div>
    </div>
  );
}
