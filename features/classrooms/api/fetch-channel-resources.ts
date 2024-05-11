"use server"

import { API_ENDPOINTS } from "@/constants";
import { handleError } from "@/utils/handle-error";
import { cookies } from "next/headers";
import { TResourceWithMetadata } from "../types";

type TFetchClassroomResourcesProps = {
    channelId: string;
};

export async function fetchChannelResources({ channelId }: TFetchClassroomResourcesProps): Promise<{ data: TResourceWithMetadata[] }> {
    const urlSearchParams = new URLSearchParams({ channelId });

    const response = await fetch(`${API_ENDPOINTS.CLASSROOM.CHANNEL.RESOURCE.GET_ALL}?${urlSearchParams}`, {
        headers: { Cookie: cookies().toString() },
    });

    if (!response.ok) {
        handleError(response.status)
    }

    const data = await response.json();

    return data;
};