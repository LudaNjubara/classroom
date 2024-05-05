import observableError from "@/services/ErrorObserver";
import { useEffect, useState } from "react";
import { fetchClassroomChannels } from "../api";
import { TClassroomWithChannels } from "../types";

export function useClassroomChannels(classroomId?: string) {
    const [classrooms, setClassrooms] = useState<TClassroomWithChannels>();
    const [isLoading, setIsLoading] = useState(false);

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
                    observableError.notify({ title: "Failed to fetch classrooms", description: error.message });
                }
            } finally {
                setIsLoading(false);
            }
        };

        getClassroomChannels();
    }, [classroomId]);

    return { data: classrooms, isLoading };
}

