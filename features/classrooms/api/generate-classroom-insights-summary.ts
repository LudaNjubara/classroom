"use server"

import { API_ENDPOINTS } from "@/constants"
import { StatisticsSummary } from "@prisma/client"
import { cookies } from "next/headers"

export const generateInsightsSummary = async (prompt: string): Promise<{ insightSummary: StatisticsSummary }> => {
    const response = await fetch(API_ENDPOINTS.STATISTICS.GENERATE_SUMMARY, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Cookie: cookies().toString()
        },
        body: JSON.stringify({ prompt })
    })

    if (!response.ok) {
        const res = await response.json()

        throw new Error(res.error);
    }

    return await response.json();
}