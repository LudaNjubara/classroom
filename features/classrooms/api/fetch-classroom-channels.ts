"use server"

import { API_ENDPOINTS } from "@/constants";
import { handleError } from "@/utils/handle-error";
import { cookies } from "next/headers";
import { TClassroomWithChannels } from "../types";

type TFetchClassroomsProps = {
    classroomId: string;
};

export async function fetchClassroomChannels({ classroomId }: TFetchClassroomsProps): Promise<{ data: TClassroomWithChannels }> {
    const urlSearchParams = new URLSearchParams({ classroomId });

    const response = await fetch(`${API_ENDPOINTS.CLASSROOM.CHANNEL.GET_ALL}?${urlSearchParams}`, {
        headers: { Cookie: cookies().toString() },
    });

    if (!response.ok) {
        handleError(response.status)
    }

    const data = await response.json();

    return data;
};