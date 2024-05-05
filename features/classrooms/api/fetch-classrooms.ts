"use server"

import { API_ENDPOINTS } from "@/constants";
import { handleError } from "@/utils/handle-error";
import { cookies } from "next/headers";
import { TClassroomWithSettings } from "../types";

type TFetchClassroomsProps = {
    organizationId: string;
};

export async function fetchClassrooms({ organizationId }: TFetchClassroomsProps): Promise<{ data: TClassroomWithSettings[] }> {
    const urlSearchParams = new URLSearchParams({ organizationId });

    const response = await fetch(`${API_ENDPOINTS.CLASSROOM.GET_ALL}?${urlSearchParams}`, {
        headers: { Cookie: cookies().toString() },
    });

    if (!response.ok) {
        handleError(response.status)
    }

    const data = await response.json();

    return data;
};