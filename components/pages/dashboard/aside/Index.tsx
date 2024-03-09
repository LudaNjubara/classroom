import { Button } from "@/components/ui/button";
import { useDashboardContext } from "@/context/DashboardContext";
import { useDashboardStore } from "@/lib/store/DashboardStore";
import { TDashboardAsideTab } from "@/types/typings";
import { Role } from "@prisma/client";
import { Bell, BookOpen, FlaskConical, GraduationCap, Settings } from "lucide-react";
import { useMemo } from "react";

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

export default function DashboardAside() {
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
