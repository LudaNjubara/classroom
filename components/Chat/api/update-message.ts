"use server"

import { API_ENDPOINTS } from "@/constants";
import { cookies } from "next/headers";

export async function updateMessage(
    messageId: string,
    content: string,
    channelId: string,
) {
    const urlSearchParams = new URLSearchParams({
        channelId,
        messageId
    });

    const response = await fetch(`${API_ENDPOINTS.MESSAGES.UPDATE}/${messageId}?${urlSearchParams}`, {
        method: "PATCH",
        headers: {
            Cookie: cookies().toString()
        },
        body: JSON.stringify({ content }),
    });

    return await response.json();
}