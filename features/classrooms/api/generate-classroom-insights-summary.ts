"use server"

import { API_ENDPOINTS } from "@/constants"
import { StatisticsSummary } from "@prisma/client"
import { cookies } from "next/headers"

type TGenerateInsightsSummaryProps = {
    prompt: string;
    classroomId: string;
}

export const generateInsightsSummary = async ({ prompt, classroomId }: TGenerateInsightsSummaryProps): Promise<{ insightSummary: StatisticsSummary }> => {
    const response = await fetch(API_ENDPOINTS.STATISTICS.GENERATE_SUMMARY, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Cookie: cookies().toString()
        },
        body: JSON.stringify({ prompt, classroomId })
    })

    if (!response.ok) {
        const res = await response.json()

        throw new Error(res.error);
    }

    return await response.json();
}