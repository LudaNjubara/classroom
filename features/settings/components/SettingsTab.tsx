"use client";

import { Separator } from "@/components/ui/separator";
import { useDashboardContext } from "@/context";
import { Role } from "@prisma/client";
import { OrganizationSettingsDisplay } from "./organization/OrganizationSettingsDisplay";
import { StudentSettingsDisplay } from "./student/StudentSettingsDisplay";
import { TeacherSettingsDisplay } from "./techer/TeacherSettingsDisplay";

type TAllowedRoles = Exclude<Role, "GUEST" | "ADMIN">;

const displayToRender: {
  [key in TAllowedRoles]: React.ReactNode;
} = {
  ORGANIZATION: <OrganizationSettingsDisplay />,
  STUDENT: <StudentSettingsDisplay />,
  TEACHER: <TeacherSettingsDisplay />,
};

export function SettingsTab() {
  // context
  const { profile } = useDashboardContext();

  return (
    <div>
      <div>
        <h2 className="text-2xl font-medium">Settings</h2>
        <p className="text-slate-600">
          {`View and manage settings related to you ${
            profile.role === "ORGANIZATION"
              ? "organization"
              : profile.role === "STUDENT"
              ? "student"
              : "teacher"
          } account here`}
        </p>
      </div>

      <Separator className="my-4" />

      {displayToRender[profile.role as TAllowedRoles]}
    </div>
  );
}
