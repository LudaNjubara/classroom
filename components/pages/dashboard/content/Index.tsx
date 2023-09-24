import { useDashboardStore } from "@/lib/store/DashboardStore";
import { TDashboardAsideTab } from "@/types/typings";
import ClassroomsTab from "@components/pages/dashboard/content/ClassroomsTab";
import SettingsTab from "@components/pages/dashboard/content/SettingsTab";
import StudentsTab from "@components/pages/dashboard/content/StudentsTab";
import TeachersTab from "@components/pages/dashboard/content/TeachersTab";

type TContentToRender = {
  [key in keyof TDashboardAsideTab]: React.ReactNode;
};

const tabToRender: TContentToRender = {
  classrooms: <ClassroomsTab />,
  teachers: <TeachersTab />,
  students: <StudentsTab />,
  settings: <SettingsTab />,
};

function EmptyContent() {
  return (
    <>
      <h2 className="text-2xl font-semibold">Welcome to your dashboard</h2>
      <p className="text-lg text-slate-600">Select a tab from the left to get started</p>
    </>
  );
}

export default function DashboardContent() {
  // zustand state and actions
  const selectedTab = useDashboardStore((state) => state.selectedTab);

  return (
    <div className="flex-1 p-4 min-h-full overflow-auto border-8 border-slate-200 dark:border-slate-800/60 rounded-md">
      {selectedTab ? tabToRender[selectedTab] : <EmptyContent />}
    </div>
  );
}
