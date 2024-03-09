import DashboardView from "@/components/views/DashboardView";
import fetchOrganizations from "@/lib/fetchers/fetch-organizations";
import { initialProfile } from "@/lib/initial-profile";
import observableError from "@/services/ErrorObserver";
import { TOrganizationWithClassroomsWithStudentsWithTeachers } from "@/types/typings";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const { isAuthenticated } = getKindeServerSession();

  if (!isAuthenticated()) redirect("/");

  const profile = await initialProfile();

  let organizations: TOrganizationWithClassroomsWithStudentsWithTeachers[] = [];

  const handleFetchOrganizations = async () => {
    try {
      const returnedOrganizations = await fetchOrganizations();
      if (returnedOrganizations) organizations = returnedOrganizations;
    } catch (error) {
      if (error instanceof Error)
        observableError.notify({ title: "Failed to fetch organizations", description: error.message });
    }
  };

  if (profile.role !== "GUEST") {
    await handleFetchOrganizations();
  }

  return (
    <main>
      <DashboardView profile={profile} organizations={organizations} />
    </main>
  );
}
