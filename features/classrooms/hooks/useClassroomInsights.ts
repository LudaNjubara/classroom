import { HTTP_STATUS_CODES } from "@/constants";
import { useEffect, useState } from "react";
import { fetchClassroomInsights } from "../api/fetch-classroom-insights";
import { TClassroomInsight } from "../types";

export function useClassroomInsights(classroomId?: string) {
    const [insights, setInsights] = useState<TClassroomInsight>();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<{ message: string, statusCode?: number } | null>(null);
    const [refetchIndex, setRefetchIndex] = useState(0);

    useEffect(() => {
        if (!classroomId) return;

        const getClassroomInsights = async () => {
            setIsLoading(true);

            const requestData = { classroomId };

            try {
                const { data } = await fetchClassroomInsights(requestData);

                setInsights(data);
                setError(null);
            } catch (error) {
                if (error instanceof Error) {
                    if (error.message === HTTP_STATUS_CODES.UNPROCESSABLE_CONTENT.toString()) {
                        setError({ message: error.message, statusCode: HTTP_STATUS_CODES.UNPROCESSABLE_CONTENT });
                    } else {
                        setError({ message: error.message });
                    }
                }
            } finally {
                setIsLoading(false);
            }
        };

        getClassroomInsights();
    }, [classroomId, refetchIndex]);

    const refetch = () => setRefetchIndex((prev) => prev + 1);

    return { data: insights, isLoading, error, refetch };
}

