"use client"

import observableError from "@/services/ErrorObserver";
import { TPaginatedResponse } from "@/types/typings";
import { useEffect, useState } from "react";
import { TTeacherWithProfile, TTeachersFetchFilterParams, fetchTeachers } from "..";

export function useTeachers(
    filterParams?: TTeachersFetchFilterParams,
    organizationId?: string
) {
    const [data, setData] = useState<TPaginatedResponse<TTeacherWithProfile>>({ data: [], count: 0 });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const getTeachers = async () => {
            const finalFilterParams = { ...filterParams, organizationId };

            try {
                setIsLoading(true);
                const paginatedTeachers = await fetchTeachers(finalFilterParams);
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
    }, [filterParams, organizationId]);

    return { data, isLoading };
}