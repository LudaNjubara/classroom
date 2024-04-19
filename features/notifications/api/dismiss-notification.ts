"use server"

import { API_ENDPOINTS } from "@/constants";
import { handleError } from "@/utils/handle-error";
import { Notification } from "@prisma/client";
import { cookies } from "next/headers";

export const dismissNotification = async (notification: Notification) => {
    const response = await fetch(API_ENDPOINTS.NOTIFICATION.DISMISS, {
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