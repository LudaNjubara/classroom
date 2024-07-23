"use server"

import { API_ENDPOINTS } from "@/constants";
import { StatisticsSummary } from "@prisma/client";
import { cookies } from "next/headers";

type TFetchClassroomInsightSummaryProps = {
    classroomId: string;
};

export async function fetchClassroomInsightSummary({ classroomId }: TFetchClassroomInsightSummaryProps): Promise<{ data: StatisticsSummary | null }> {
    const urlSearchParams = new URLSearchParams({ classroomId });

    const response = await fetch(`${API_ENDPOINTS.STATISTICS.GET_SUMMARY}?${urlSearchParams}`, {
        headers: { Cookie: cookies().toString() },
    });

    if (!response.ok) {
        const res = await response.json();

        if (res.error) {
            throw new Error(res.error);
        }
    }

    const data = await response.json();

    return data;
};