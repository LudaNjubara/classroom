"use server"

import { API_ENDPOINTS, HTTP_STATUS_CODES } from "@/constants";
import { cookies } from "next/headers";
import { TClassroomInsight } from "../types";

type TFetchClassroomInsightsProps = {
    classroomId: string;
};

export async function fetchClassroomInsights({ classroomId }: TFetchClassroomInsightsProps): Promise<{ data: TClassroomInsight }> {
    const urlSearchParams = new URLSearchParams({ classroomId });

    const response = await fetch(`${API_ENDPOINTS.STATISTICS.GET}?${urlSearchParams}`, {
        headers: { Cookie: cookies().toString() },
    });

    if (!response.ok) {
        const res = await response.json();

        if (response.status === HTTP_STATUS_CODES.UNPROCESSABLE_CONTENT) {
            throw new Error(response.status.toString());
        }

        throw new Error(res.error);
    }

    const data = await response.json();

    return data;
};