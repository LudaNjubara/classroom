import observableError from "@/services/ErrorObserver";
import { ClassroomChannel } from "@prisma/client";
import { useEffect, useState } from "react";
import { fetchClassroomChannels } from "../api";

export function useClassroomChannels(classroomId?: string) {
    const [classrooms, setClassrooms] = useState<ClassroomChannel[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [refetchIndex, setRefetchIndex] = useState(0);

    useEffect(() => {
        if (!classroomId) return;

        const getClassroomChannels = async () => {
            setIsLoading(true);

            const requestData = { classroomId };

            try {
                const { data } = await fetchClassroomChannels(requestData);

                setClassrooms(data);
            } catch (error) {
                if (error instanceof Error) {
                    observableError.notify({ title: "Failed to fetch classroom channels", description: error.message });
                }
            } finally {
                setIsLoading(false);
            }
        };

        getClassroomChannels();
    }, [classroomId, refetchIndex]);

    const refetch = () => setRefetchIndex((prev) => prev + 1);

    return { data: classrooms, isLoading, refetch };
}

