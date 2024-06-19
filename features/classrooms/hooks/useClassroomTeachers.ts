import observableError from "@/services/ErrorObserver";
import { Teacher } from "@prisma/client";
import { useEffect, useState } from "react";
import { fetchClassroomTeachers } from "../api/fetch-classroom-teachers";


export function useClassroomTeachers(classroomId?: string) {
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [refetchIndex, setRefetchIndex] = useState(0);

    useEffect(() => {
        if (!classroomId) return;

        const getClassroomTeachers = async () => {
            setIsLoading(true);

            const requestData = { classroomId };

            try {
                const { data } = await fetchClassroomTeachers(requestData);

                setTeachers(data);
            } catch (error) {
                if (error instanceof Error) {
                    observableError.notify({ title: "Failed to fetch classroom teachers", description: error.message });
                }
            } finally {
                setIsLoading(false);
            }
        };

        getClassroomTeachers();
    }, [classroomId, refetchIndex]);

    const refetch = () => setRefetchIndex((prev) => prev + 1);

    return { data: teachers, isLoading, refetch };
}