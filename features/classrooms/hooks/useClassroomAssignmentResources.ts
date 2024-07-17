import observableError from "@/services/ErrorObserver";
import { useEffect, useState } from "react";
import { fetchClassroomAssignmentResources } from "../api/fetch-classroom-assignment-resources";
import { TResourceWithMetadata } from "../types";

export function useClassroomAssignmentResources(assignmentId?: string) {
    const [resources, setResources] = useState<TResourceWithMetadata[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [refetchIndex, setRefetchIndex] = useState(0);

    useEffect(() => {
        if (!assignmentId) return;

        const getClassroomResources = async () => {
            setIsLoading(true);

            const requestData = { assignmentId };

            try {
                const { data } = await fetchClassroomAssignmentResources(requestData);

                setResources(data);
            } catch (error) {
                if (error instanceof Error) {
                    observableError.notify({ title: "Failed to fetch classroom assignment resources", description: error.message });
                }
            } finally {
                setIsLoading(false);
            }
        };

        getClassroomResources();
    }, [assignmentId, refetchIndex]);

    const refetch = () => setRefetchIndex((prev) => prev + 1);

    return { data: resources, isLoading, refetch };
}

