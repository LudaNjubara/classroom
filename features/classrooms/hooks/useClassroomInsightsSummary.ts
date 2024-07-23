import observableError from "@/services/ErrorObserver";
import { StatisticsSummary } from "@prisma/client";
import { useEffect, useState } from "react";
import { fetchClassroomInsightSummary } from "../api/fetch-classroom-insight-summary";

export function useClassroomInsightsSummary(classroomId?: string) {
    const [insightSummary, setInsightSummary] = useState<StatisticsSummary | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<{ message: string } | null>(null);
    const [refetchIndex, setRefetchIndex] = useState(0);

    useEffect(() => {
        if (!classroomId) return;

        const getClassroomInsightSummary = async () => {
            setIsLoading(true);

            const requestData = { classroomId };

            try {
                const { data } = await fetchClassroomInsightSummary(requestData);

                setInsightSummary(data);
                setError(null);
            } catch (error) {
                if (error instanceof Error) {
                    observableError.notify({ title: "Failed to fetch classroom insight summary", description: error.message });
                }
            } finally {
                setIsLoading(false);
            }
        };

        getClassroomInsightSummary();
    }, [classroomId, refetchIndex]);

    const refetch = () => setRefetchIndex((prev) => prev + 1);

    return { data: insightSummary, isLoading, error, refetch };
}

