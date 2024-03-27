"use server"

import { API_ENDPOINTS } from "@/constants";
import { TPaginatedResponse } from "@/types/typings";
import { handleError } from "@/utils/handle-error";
import { Notification } from "@prisma/client";
import { cookies } from "next/headers";

export async function fetchOrganizationNotifications(): Promise<TPaginatedResponse<Notification>> {

    const response = await fetch(API_ENDPOINTS.NOTIFICATION.ORGANIZATION, {
        headers: { Cookie: cookies().toString() },
    });

    if (!response.ok) {
        handleError(response.status)
    }

    const data = await response.json();

    return data;
}