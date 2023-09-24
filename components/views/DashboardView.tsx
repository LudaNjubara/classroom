import DashboardWindowLayout from "@/components/pages/dashboard/DashboardWindowLayout";
import { TOrganizationWithClassroomsWithStudentsWithTeachers } from "@/types/typings";
import GuestDashboard from "@components/pages/dashboard/guest/Index";
import { Profile } from "@prisma/client";

type TProps = {
  profile: Profile;
  organizations: TOrganizationWithClassroomsWithStudentsWithTeachers[];
};

export default function DashboardView({ profile, organizations }: TProps) {
  const contextValue = {
    profile,
    organizations,
  };

  return profile.role === "GUEST" ? (
    <GuestDashboard profile={profile} />
  ) : (
    <DashboardWindowLayout contextValue={contextValue} />
  );
}
