"use client";

import { Button } from "@/components/ui/button";
import { DashboardContext } from "@/context/DashboardContext";
import { useDashboardStore } from "@/lib/store/DashboardStore";
import { TOrganizationWithClassroomsWithStudentsWithTeachers, TRole } from "@/types/typings";
import DashboardAside from "@components/pages/dashboard/aside/Index";
import DashboardContent from "@components/pages/dashboard/content/Index";
import { Profile } from "@prisma/client";

type TProps = {
  contextValue: {
    profile: Profile;
    organizations: TOrganizationWithClassroomsWithStudentsWithTeachers[];
  };
};

const allowedRoles: TRole[] = ["ADMIN", "ORGANIZATION", "TEACHER", "STUDENT"];

export default function DashboardWindowLayout({ contextValue }: TProps) {
  const { profile, organizations } = contextValue;

  // zustand state and actions
  const selectedOrganization = useDashboardStore((state) => state.selectedOrganization);
  const setSelectedOrganization = useDashboardStore((state) => state.setSelectedOrganization);

  if (!selectedOrganization) setSelectedOrganization(organizations[0]);

  const handleSelectedOrganizationClick = (item: TOrganizationWithClassroomsWithStudentsWithTeachers) => {
    if (item.id === selectedOrganization?.id) return;
    setSelectedOrganization(item);
  };

  return (
    <DashboardContext.Provider value={contextValue}>
      <div>
        <header className="flex gap-4 mb-2 py-2">
          <h2 className="min-w-[200px] w-fit">Dashboard</h2>

          {profile.role !== "ORGANIZATION" && (
            <ul className="flex gap-3 items-center overflow-x-auto">
              {organizations.map((org) => (
                <li key={org.id}>
                  <Button size="sm" className="py-1" onClick={() => handleSelectedOrganizationClick(org)}>
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
              <DashboardAside />
              <DashboardContent />
            </>
          )}
        </div>
      </div>
    </DashboardContext.Provider>
  );
}
