"use server"

import { API_ENDPOINTS } from "@/constants";
import { handleError } from "@/utils/handle-error";
import { cookies } from "next/headers";
import { TResourceWithMetadata } from "../types";

type TFetchClassroomResourcesProps = {
    classroomId: string;
};

export async function fetchClassroomResources({ classroomId }: TFetchClassroomResourcesProps): Promise<{ data: TResourceWithMetadata[] }> {
    const urlSearchParams = new URLSearchParams({ classroomId });

    const response = await fetch(`${API_ENDPOINTS.CLASSROOM.RESOURCE.GET_ALL}?${urlSearchParams}`, {
        headers: { Cookie: cookies().toString() },
    });

    if (!response.ok) {
        handleError(response.status)
    }

    const data = await response.json();

    return data;
};