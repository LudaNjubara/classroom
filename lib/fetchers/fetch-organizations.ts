import { TOrganizationWithClassroomsWithStudentsWithTeachers } from "@/types/typings";
import { API_ENDPOINTS } from "@lib/constants/api-constants";
import { handleError } from "@lib/helpers/handle-error";
import { cookies } from "next/headers";


const fetchOrganizations = async (): Promise<TOrganizationWithClassroomsWithStudentsWithTeachers[] | undefined> => {
    const response = await fetch(API_ENDPOINTS.ORGANIZATION, {
        headers: { Cookie: cookies().toString() },
    });

    if (!response.ok) {
        handleError(response.status);
        return;
    }

    const { organizations } = await response.json();

    return organizations;
};

export default fetchOrganizations;