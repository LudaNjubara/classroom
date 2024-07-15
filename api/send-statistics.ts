"use server"

import { API_ENDPOINTS } from "@/constants";
import { TEventQueue } from "@/types/typings";
import { cookies } from "next/headers";

export async function sendStatistics(events: TEventQueue[]) {
    const response = await fetch(API_ENDPOINTS.STATISTICS, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Cookie: cookies().toString()
        },
        body: JSON.stringify({ eventsQueue: events }),
    })

    if (!response.ok) {
        const res = await response.json()

        throw new Error(res.error);
    }

    return response.json() as unknown as { success: boolean };
}