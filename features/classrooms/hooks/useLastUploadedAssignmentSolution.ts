import { AssignmentSolution } from "@prisma/client";
import { useEffect, useState } from "react";
import { fetchLastUploadedClassroomAssignmentSolution } from "../api/fetch-last-uploaded-classroom-assignment-solution";

export function useLastUploadedAssignmentSolution(assignmentId: string) {
    const [assignmentSolution, setAssignmentSolution] = useState<AssignmentSolution>();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [refetchIndex, setRefetchIndex] = useState(0);

    useEffect(() => {
        if (!assignmentId) return;

        const getLastUploadedClassroomAssignmentSolution = async () => {
            setIsLoading(true);

            const requestData = { assignmentId };

            try {
                const { data } = await fetchLastUploadedClassroomAssignmentSolution(requestData);

                setAssignmentSolution(data);
            } catch (error) {
                if (error instanceof Error) {
                    setError(error.message);
                }
            } finally {
                setIsLoading(false);
            }
        };

        getLastUploadedClassroomAssignmentSolution();
    }, [assignmentId, refetchIndex]);

    const refetch = () => setRefetchIndex((prev) => prev + 1);

    return { data: assignmentSolution, isLoading, error, refetch };
}

