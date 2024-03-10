import { API_ENDPOINTS } from "@/constants/api-constants";
import { TOrganizationWithClassroomsWithStudentsWithTeachers } from "@/types/typings";
import { cookies } from "next/headers";


const fetchOrganizations = async (): Promise<TOrganizationWithClassroomsWithStudentsWithTeachers[]> => {

    const response = await fetch(API_ENDPOINTS.ORGANIZATION, {
        headers: { Cookie: cookies().toString() },
    });

    if (!response.ok) {
        throw new Error("There was an error fetching organizations. Please try again.");
    }

    const { organizations } = await response.json();

    return organizations;

};

export default fetchOrganizations;