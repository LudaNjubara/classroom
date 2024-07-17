import { DashboardLayout } from "@/components/Layout";
import { EdgeStoreProvider } from "@/config/edgestore";
import { CreateAccount } from "@/features/create-account";
import { QueryProvider } from "@/providers/query-provider";
import { SocketProvider } from "@/providers/socket-provider";
import { StatisticsProvider } from "@/providers/statistics-provider";
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
      <SocketProvider>
        <QueryProvider>
          <StatisticsProvider>
            <DashboardLayout contextValue={contextValue} />
          </StatisticsProvider>
        </QueryProvider>
      </SocketProvider>
    </EdgeStoreProvider>
  );
}
