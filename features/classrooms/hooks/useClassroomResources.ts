import observableError from "@/services/ErrorObserver";
import { useEffect, useState } from "react";
import { fetchClassroomResources } from "../api/fetch-classroom-resources";
import { TResourceWithMetadata } from "../types";

export function useClassroomResources(classroomId?: string) {
    const [resources, setResources] = useState<TResourceWithMetadata[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [refetchIndex, setRefetchIndex] = useState(0);

    useEffect(() => {
        if (!classroomId) return;

        const getClassroomResources = async () => {
            setIsLoading(true);

            const requestData = { classroomId };

            try {
                const { data } = await fetchClassroomResources(requestData);

                setResources(data);
            } catch (error) {
                if (error instanceof Error) {
                    observableError.notify({ title: "Failed to fetch classroom resources", description: error.message });
                }
            } finally {
                setIsLoading(false);
            }
        };

        getClassroomResources();
    }, [classroomId, refetchIndex]);

    const refetch = () => setRefetchIndex((prev) => prev + 1);

    return { data: resources, isLoading, refetch };
}

