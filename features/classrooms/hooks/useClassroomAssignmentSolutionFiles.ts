import { AssignmentSolutionFile } from "@prisma/client";
import { useEffect, useState } from "react";
import { fetchClassroomAssignmentSolutionFiles } from "../api/fetch-classroom-assignment-solution-files";

export function useClassroomAssignmentSolutionFiles(solutionId?: string) {
    const [assignmentSolutionFiles, setAssignmentSolutionFiles] = useState<AssignmentSolutionFile[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [refetchIndex, setRefetchIndex] = useState(0);

    useEffect(() => {
        if (!solutionId) return;

        const getClassroomAssignmentSolutionFiles = async () => {
            setIsLoading(true);

            const requestData = { solutionId };

            try {
                const { data } = await fetchClassroomAssignmentSolutionFiles(requestData);

                setAssignmentSolutionFiles(data);
            } catch (error) {
                if (error instanceof Error) {
                    setError(error.message);
                }
            } finally {
                setIsLoading(false);
            }
        };

        getClassroomAssignmentSolutionFiles();
    }, [solutionId, refetchIndex]);

    const refetch = () => setRefetchIndex((prev) => prev + 1);

    return { data: assignmentSolutionFiles, isLoading, error, refetch };
}

