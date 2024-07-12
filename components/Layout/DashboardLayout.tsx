"use client";

import { Button } from "@/components/ui/button";
import { DashboardContext, useDashboardContext } from "@/context";
import { useDashboardStore } from "@/stores/dashboard/DashboardStore";
import {
  TDashboardAsideTab,
  TOrganizationWithClassroomsWithStudentsWithTeachers,
  TRole,
} from "@/types/typings";
import { SocketIndicator } from "@components/Socket";
import { Profile, Role } from "@prisma/client";
import { Bell, BookOpen, FlaskConical, GraduationCap, Settings } from "lucide-react";
import { useEffect, useMemo } from "react";
import { DashboardContentLayout } from ".";

type TAsideItem = {
  id: keyof TDashboardAsideTab;
  label: string;
  icon: React.ReactNode;
  allowedRoles: Role[];
};

const asideItems: TAsideItem[] = [
  {
    id: "classrooms",
    label: "Classrooms",
    icon: <FlaskConical size={20} />,
    allowedRoles: ["ADMIN", "ORGANIZATION", "TEACHER", "STUDENT"],
  },
  {
    id: "teachers",
    label: "Teachers",
    icon: <BookOpen size={20} />,
    allowedRoles: ["ADMIN", "ORGANIZATION"],
  },
  {
    id: "students",
    label: "Students",
    icon: <GraduationCap size={23} />,
    allowedRoles: ["ADMIN", "ORGANIZATION"],
  },
  {
    id: "notifications",
    label: "Notifications",
    icon: <Bell size={20} />,
    allowedRoles: ["ADMIN", "ORGANIZATION", "TEACHER", "STUDENT"],
  },
];

export function DashboardSidebar() {
  const { profile } = useDashboardContext();

  // zustand state and actions
  const setSelectedTab = useDashboardStore((state) => state.setSelectedTab);
  const selectedTab = useDashboardStore((state) => state.selectedTab);

  const filteredAsideItems = useMemo(
    () => asideItems.filter((item) => item.allowedRoles.includes(profile.role)),
    [profile.role]
  );

  const handleSelectTab = (tabId: keyof TDashboardAsideTab) => {
    if (tabId === selectedTab) return;
    setSelectedTab(tabId);
  };

  return (
    <aside className="min-w-[200px] min-h-full">
      <ul className="flex flex-col gap-1 h-full">
        {filteredAsideItems.map((item) => {
          const isSelected = selectedTab === item.id;

          return (
            <li key={item.id}>
              <Button
                className={`w-full flex items-center justify-start gap-3 pt-0 pb-0 pl-0 overflow-hidden text-slate-900 bg-slate-300/60 hover:bg-slate-300 dark:text-slate-200 dark:bg-slate-800/60 dark:hover:bg-slate-800 transition-colors duration-300 ${
                  isSelected && "bg-slate-300 dark:bg-slate-800"
                }`}
                onClick={() => handleSelectTab(item.id)}
              >
                <span
                  className={`h-full w-[40px] grid place-items-center bg-slate-300 dark:bg-slate-800 ${
                    isSelected ? "[&>svg]:opacity-100" : "[&>svg]:opacity-50"
                  }`}
                >
                  {item.icon}
                </span>
                {item.label}
              </Button>
            </li>
          );
        })}

        <li className="mt-auto">
          <Button
            className={`w-full flex items-center justify-start gap-3 pt-0 pb-0 pl-0 overflow-hidden text-slate-900 bg-slate-300/60 hover:bg-slate-300 dark:text-slate-200 dark:bg-slate-800/60 dark:hover:bg-slate-800 transition-colors duration-300 ${
              selectedTab === "settings" && "bg-slate-300 dark:bg-slate-800"
            }`}
            onClick={() => handleSelectTab("settings")}
          >
            <span className="h-full w-[40px] grid place-items-center bg-slate-300 dark:bg-slate-800">
              <Settings className={selectedTab === "settings" ? "opacity-100" : "opacity-50"} size={20} />
            </span>
            Settings
          </Button>
        </li>
      </ul>
    </aside>
  );
}

type TDashboardLayoutProps = {
  contextValue: {
    profile: Profile;
    organizations: TOrganizationWithClassroomsWithStudentsWithTeachers[];
  };
};

const allowedRoles: TRole[] = ["ADMIN", "ORGANIZATION", "TEACHER", "STUDENT"];

export function DashboardLayout({ contextValue }: TDashboardLayoutProps) {
  const { profile, organizations } = contextValue;

  // zustand state and actions
  const selectedOrganization = useDashboardStore((state) => state.selectedOrganization);
  const setSelectedOrganization = useDashboardStore((state) => state.setSelectedOrganization);
  const resetClassroomTabSlice = useDashboardStore((state) => state.resetClassroomTabSlice);

  const handleSelectedOrganizationClick = (org: TOrganizationWithClassroomsWithStudentsWithTeachers) => {
    if (org.id === selectedOrganization?.id) return;

    resetClassroomTabSlice();
    setSelectedOrganization(org);
  };

  useEffect(() => {
    if (!selectedOrganization && organizations.length > 0) setSelectedOrganization(organizations[0]);
  }, [organizations, profile.role, selectedOrganization]);

  return (
    <DashboardContext.Provider value={contextValue}>
      <div>
        <header className="flex gap-4 mb-2 py-2 pl-3 ml-[200px]">
          {profile.role !== "ORGANIZATION" && (
            <ul className="flex gap-3 items-center overflow-x-auto">
              {organizations.map((org) => (
                <li key={org.id}>
                  <Button
                    size="sm"
                    variant={selectedOrganization?.id === org.id ? "default" : "secondary"}
                    className="py-1"
                    onClick={() => handleSelectedOrganizationClick(org)}
                  >
                    {org.name}
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </header>

        <div className="flex gap-3 max-h-[800px] min-h-[700px]">
          {allowedRoles.includes(profile.role) && (
            <>
              <DashboardSidebar />
              <DashboardContentLayout />

              <div className="fixed bottom-4 right-2">
                <SocketIndicator />
              </div>
            </>
          )}
        </div>
      </div>
    </DashboardContext.Provider>
  );
}
