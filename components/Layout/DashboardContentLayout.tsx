"use client";

import { useDashboardStore } from "@/stores";
import { TDashboardAsideTab } from "@/types/typings";
import { lazyImport } from "@/utils/lazy-import";

const { ClassroomsTab } = lazyImport(() => import("@/features/classrooms"), "ClassroomsTab");
const { TeachersTab } = lazyImport(() => import("@/features/teachers"), "TeachersTab");
const { StudentsTab } = lazyImport(() => import("@/features/students"), "StudentsTab");
const { NotificationsTab } = lazyImport(() => import("@/features/notifications"), "NotificationsTab");
const { CommunityTab } = lazyImport(() => import("@/features/community"), "CommunityTab");
const { SettingsTab } = lazyImport(() => import("@/features/settings"), "SettingsTab");

type TContentToRender = {
  [key in keyof TDashboardAsideTab]: React.ReactNode;
};

const tabToRender: TContentToRender = {
  classrooms: <ClassroomsTab />,
  teachers: <TeachersTab />,
  students: <StudentsTab />,
  notifications: <NotificationsTab />,
  community: <CommunityTab />,
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

export function DashboardContentLayout() {
  // zustand state and actions
  const selectedTab = useDashboardStore((state) => state.selectedTab);

  return (
    <div className="relative flex-1 p-4 min-h-full overflow-y-auto overflow-x-hidden border-8 bg-slate-300 dark:bg-slate-950 border-slate-100 dark:border-slate-800/60 rounded-md">
      {selectedTab ? tabToRender[selectedTab] : <EmptyContent />}
    </div>
  );
}
