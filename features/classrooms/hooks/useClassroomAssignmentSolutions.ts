import { useEffect, useState } from "react";
import { fetchClassroomAssignmentSolutions } from "../api/fetch-classroom-assignment-solutions";
import { TAssignmentSolutionWithStudent } from "../types";

export function useClassroomAssignmentSolutions(assignmentId?: string) {
    const [assignmentSolutions, setAssignmentSolutions] = useState<TAssignmentSolutionWithStudent[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [refetchIndex, setRefetchIndex] = useState(0);

    useEffect(() => {
        if (!assignmentId) return;

        const getClassroomAssignmentSolutions = async () => {
            setIsLoading(true);

            const requestData = { assignmentId };

            try {
                const { data } = await fetchClassroomAssignmentSolutions(requestData);

                setAssignmentSolutions(data);
            } catch (error) {
                if (error instanceof Error) {
                    setError(error.message);
                }
            } finally {
                setIsLoading(false);
            }
        };

        getClassroomAssignmentSolutions();
    }, [assignmentId, refetchIndex]);

    const refetch = () => setRefetchIndex((prev) => prev + 1);

    return { data: assignmentSolutions, isLoading, error, refetch };
}

