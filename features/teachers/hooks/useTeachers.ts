import fetchTeachers from "@/features/teachers/api/fetch-teachers";
import observableError from "@/services/ErrorObserver";
import { TTeacherWithProfile, TTeachersFetchFilterParams } from "@/types/typings";
import { useEffect, useState } from "react";

export function useTeachers(filterParams: TTeachersFetchFilterParams | undefined) {
    const [data, setData] = useState<TTeacherWithProfile[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const getTeachers = async () => {
            try {
                setIsLoading(true);
                const teachers = await fetchTeachers(filterParams);
                setData(teachers);

            } catch (error) {
                if (error instanceof Error) {
                    observableError.notify({ title: "Failed to fetch teachers", description: error.message });
                }
            } finally {
                setIsLoading(false);
            }
        };

        getTeachers();
    }, [filterParams]);

    console.log("data", data)

    return { data, isLoading };
}