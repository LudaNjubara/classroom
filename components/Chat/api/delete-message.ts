"use server"

import { API_ENDPOINTS } from "@/constants";
import { cookies } from "next/headers";

export async function deleteMessage(messageId: string) {
    const response = await fetch(`${API_ENDPOINTS.MESSAGES.DELETE}/${messageId}`, {
        method: "DELETE",
        headers: {
            Cookie: cookies().toString()
        }
    });

    return await response.json();
}