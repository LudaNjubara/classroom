"use server"

import { API_ENDPOINTS } from "@/constants";
import { handleError } from "@/utils/handle-error";
import { Notification } from "@prisma/client";
import { cookies } from "next/headers";

const recipientTypeToUrlMap = {
    ORGANIZATION: API_ENDPOINTS.NOTIFICATION.ACCEPT.ORGANIZATION,
    TEACHER: API_ENDPOINTS.NOTIFICATION.ACCEPT.TEACHER,
    STUDENT: API_ENDPOINTS.NOTIFICATION.ACCEPT.STUDENT,
};

export const acceptNotification = async (notification: Notification) => {

    const URL = recipientTypeToUrlMap[notification.recipientType];

    const response = await fetch(URL, {
        method: "PUT",
        headers: { Cookie: cookies().toString() },
        body: JSON.stringify({ notification }),
    });

    if (!response.ok) {
        handleError(response.status)
    }

    const data = await response.json();

    return data;
}