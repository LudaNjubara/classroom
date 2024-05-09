"use server"

import { API_ENDPOINTS } from "@/constants";
import { cookies } from "next/headers";

type TFetchMessagesProps = {
    channelId: string;
    pageParam?: number;
};

export async function fetchMessages({ channelId, pageParam }: TFetchMessagesProps) {
    const queryParams = new URLSearchParams({
        cursor: pageParam?.toString() ?? "",
        channelId,
    })

    const res = await fetch(`${API_ENDPOINTS.MESSAGES.GET}?${queryParams}`, {
        headers: {
            "Content-Type": "application/json",
            Cookie: cookies().toString(),
        },
    });

    return res.json();
}