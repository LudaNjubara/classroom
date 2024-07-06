import observableError from "@/services/ErrorObserver";
import { useEffect, useState } from "react";
import { fetchClassroomAssignments } from "../api/fetch-classroom-assignments";
import { TClassroomAssignmentWithTeacher } from "../types";

export function useClassroomAssignments(classroomId?: string) {
    const [assignments, setAssignments] = useState<TClassroomAssignmentWithTeacher[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [refetchIndex, setRefetchIndex] = useState(0);

    useEffect(() => {
        if (!classroomId) return;

        const getClassroomAssignments = async () => {
            setIsLoading(true);

            const requestData = { classroomId };

            try {
                const { data } = await fetchClassroomAssignments(requestData);

                setAssignments(data);
            } catch (error) {
                if (error instanceof Error) {
                    observableError.notify({ title: "Failed to fetch classroom assignments", description: error.message });
                }
            } finally {
                setIsLoading(false);
            }
        };

        getClassroomAssignments();
    }, [classroomId, refetchIndex]);

    const refetch = () => setRefetchIndex((prev) => prev + 1);

    return { data: assignments, isLoading, refetch };
}

