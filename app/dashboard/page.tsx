import DashboardView from "@/components/views/DashboardView";
import fetchOrganizations from "@/lib/fetchers/fetch-organizations";
import { initialProfile } from "@/lib/initial-profile";
import { TOrganizationWithClassroomsWithStudentsWithTeachers } from "@/types/typings";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const { isAuthenticated } = getKindeServerSession();

  if (!isAuthenticated()) redirect("/");

  const profile = await initialProfile();

  let organizations: TOrganizationWithClassroomsWithStudentsWithTeachers[] = [];

  const handleFetchOrganizations = async () => {
    const returnedOrganizations = await fetchOrganizations();
    if (returnedOrganizations) organizations = returnedOrganizations;
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
