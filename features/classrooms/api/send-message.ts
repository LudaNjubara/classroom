"use server"

import { API_ENDPOINTS } from "@/constants";
import { cookies } from "next/headers";

type TSendMessageProps = {
    message: {
        content: string;
        fileUrl?: string;
    },
    query: {
        classroomId: string;
        channelId: string;
    }
};

export async function sendMessage({ message, query }: TSendMessageProps) {
    const { content, fileUrl } = message;
    const { classroomId, channelId } = query;

    const queryParams = new URLSearchParams({
        classroomId,
        channelId,
    });

    const response = await fetch(`${API_ENDPOINTS.MESSAGES.CREATE}?${queryParams}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Cookie: cookies().toString()
        },
        body: JSON.stringify({
            content,
            fileUrl,
        }),
    });

    return await response.json();
}