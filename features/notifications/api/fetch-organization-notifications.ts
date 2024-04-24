"use server"

import { API_ENDPOINTS } from "@/constants";
import { TPaginatedResponse } from "@/types/typings";
import { handleError } from "@/utils/handle-error";
import { Notification } from "@prisma/client";
import { cookies } from "next/headers";
import { TNotificationForType } from "../types";

const roleToUrlMap: { [key in TNotificationForType]: string } = {
    ORGANIZATION: API_ENDPOINTS.NOTIFICATION.ORGANIZATION.ORGANIZATION,
    TEACHER: API_ENDPOINTS.NOTIFICATION.ORGANIZATION.TEACHER,
    STUDENT: API_ENDPOINTS.NOTIFICATION.ORGANIZATION.STUDENT,
};

export async function fetchOrganizationNotifications(profileRole: TNotificationForType): Promise<TPaginatedResponse<Notification>> {
    const URL = roleToUrlMap[profileRole];

    const response = await fetch(URL, {
        headers: { Cookie: cookies().toString() },
    });

    if (!response.ok) {
        handleError(response.status)
    }

    const data = await response.json();

    return data;
}