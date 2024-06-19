import observableError from "@/services/ErrorObserver";
import { Student } from "@prisma/client";
import { useEffect, useState } from "react";
import { fetchClassroomStudents } from "../api/fetch-classroom-students";


export function useClassroomStudents(classroomId?: string) {
    const [students, setStudents] = useState<Student[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [refetchIndex, setRefetchIndex] = useState(0);

    useEffect(() => {
        if (!classroomId) return;

        const getClassroomStudents = async () => {
            setIsLoading(true);

            const requestData = { classroomId };

            try {
                const { data } = await fetchClassroomStudents(requestData);

                setStudents(data);
            } catch (error) {
                if (error instanceof Error) {
                    observableError.notify({ title: "Failed to fetch classroom teachers", description: error.message });
                }
            } finally {
                setIsLoading(false);
            }
        };

        getClassroomStudents();
    }, [classroomId, refetchIndex]);

    const refetch = () => setRefetchIndex((prev) => prev + 1);

    return { data: students, isLoading, refetch };
}