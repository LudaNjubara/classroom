import { DashboardLayout } from "@/components/Layout";
import { EdgeStoreProvider } from "@/config/edgestore";
import { CreateAccount } from "@/features/create-account";
import { TOrganizationWithClassroomsWithStudentsWithTeachers } from "@/types/typings";
import { Profile } from "@prisma/client";

type TProps = {
  profile: Profile;
  organizations: TOrganizationWithClassroomsWithStudentsWithTeachers[];
};

export function DashboardView({ profile, organizations }: TProps) {
  const contextValue = {
    profile,
    organizations,
  };

  return profile.role === "GUEST" ? (
    <CreateAccount profile={profile} />
  ) : (
    <EdgeStoreProvider>
      <DashboardLayout contextValue={contextValue} />
    </EdgeStoreProvider>
  );
}
