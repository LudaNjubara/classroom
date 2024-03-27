
import observableError from "@/services/ErrorObserver";
import { TPaginatedResponse, TTeacherWithProfile, TTeachersFetchFilterParams } from "@/types/typings";
import { useEffect, useState } from "react";
import { fetchTeachers } from "..";

export function useTeachers(filterParams: TTeachersFetchFilterParams | undefined) {
    const [data, setData] = useState<TPaginatedResponse<TTeacherWithProfile>>({ data: [], count: 0 });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const getTeachers = async () => {
            try {
                setIsLoading(true);
                const paginatedTeachers = await fetchTeachers(filterParams);
                setData(paginatedTeachers);

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

    return { data, isLoading };
}