"use server"

import { API_ENDPOINTS } from "@/constants";
import { handleError } from "@/utils/handle-error";
import { cookies } from "next/headers";
import { TResourceWithMetadata } from "../types";

type TFetchClassroomAssignmentResourcesProps = {
    assignmentId: string;
};

export async function fetchClassroomAssignmentResources({ assignmentId }: TFetchClassroomAssignmentResourcesProps): Promise<{ data: TResourceWithMetadata[] }> {
    const urlSearchParams = new URLSearchParams({ assignmentId });

    const response = await fetch(`${API_ENDPOINTS.CLASSROOM.ASSIGNMENT.RESOURCE.GET_ALL_FOR_ASSIGNMENT}?${urlSearchParams}`, {
        headers: { Cookie: cookies().toString() },
    });

    if (!response.ok) {
        handleError(response.status)
    }

    const data = await response.json();

    return data;
};