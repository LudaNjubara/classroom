import observableError from "@/services/ErrorObserver";
import { useEffect, useState } from "react";
import { fetchClassrooms } from "../api";
import { TClassroomWithSettings } from "../types";

export function useClassrooms(organizationId?: string) {
    const [classrooms, setClassrooms] = useState<TClassroomWithSettings[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!organizationId) return;

        const getClassrooms = async () => {
            setIsLoading(true);

            const requestData = { organizationId };

            try {
                const { data } = await fetchClassrooms(requestData);

                setClassrooms(data);
            } catch (error) {
                if (error instanceof Error) {
                    observableError.notify({ title: "Failed to fetch classrooms", description: error.message });
                }
            } finally {
                setIsLoading(false);
            }
        };

        getClassrooms();
    }, [organizationId]);

    return { data: classrooms, isLoading };
}

