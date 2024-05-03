import observableError from "@/services/ErrorObserver";
import { useEffect, useState } from "react";
import { fetchClassrooms } from "../api";
import { TClassroomWithSettings } from "../types";

export function useClassrooms() {
    const [classrooms, setClassrooms] = useState<TClassroomWithSettings[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {

        const getClassrooms = async () => {
            setIsLoading(true);

            try {
                const { data } = await fetchClassrooms();

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
    }, []);

    return { data: classrooms, isLoading };
}

