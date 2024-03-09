import { useDashboardStore } from "@/lib/store/DashboardStore";
import { TDashboardAsideTab } from "@/types/typings";
import ClassroomsTab from "@components/pages/dashboard/content/ClassroomsTab";
import SettingsTab from "@components/pages/dashboard/content/SettingsTab";
import StudentsTab from "@components/pages/dashboard/content/StudentsTab";
import NotificationsTab from "./notifications-tab/Index";
import TeachersTab from "./teacher-tab/Index";

type TContentToRender = {
  [key in keyof TDashboardAsideTab]: React.ReactNode;
};

const tabToRender: TContentToRender = {
  classrooms: <ClassroomsTab />,
  teachers: <TeachersTab />,
  students: <StudentsTab />,
  notifications: <NotificationsTab />,
  settings: <SettingsTab />,
};

function EmptyContent() {
  return (
    <div className="w-full h-full grid place-items-center ">
      <h2
        className="text-6xl font-semibold bg-clip-text text-transparent
      bg-gradient-to-b from-slate-200/40 to-slate-200/90
      dark:from-slate-800 dark:to-slate-900/90"
      >
        Welcome to your dashboard
      </h2>
      <p className="py-3 px-4 rounded-sm bg-slate-100 dark:bg-slate-900 text-lg text-slate-400 dark:text-slate-500">
        Select a tab from the left to get started
      </p>
    </div>
  );
}

export default function DashboardContent() {
  // zustand state and actions
  const selectedTab = useDashboardStore((state) => state.selectedTab);

  return (
    <div className="relative flex-1 p-4 min-h-full overflow-auto border-8 bg-slate-300 dark:bg-slate-950 border-slate-100 dark:border-slate-800/60 rounded-md">
      {selectedTab ? tabToRender[selectedTab] : <EmptyContent />}
    </div>
  );
}
