"use client"

import observableError from "@/services/ErrorObserver";
import { TPaginatedResponse } from "@/types/typings";
import { useEffect, useState } from "react";
import { fetchStudents } from "../api";
import { TStudentWithProfile, TStudentsFetchFilterParams } from "../types";

export function useStudents(filterParams?: TStudentsFetchFilterParams, organizationId?: string) {
    const [data, setData] = useState<TPaginatedResponse<TStudentWithProfile>>({ data: [], count: 0 });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const getStudents = async () => {
            try {
                const finalFilterParams = { ...filterParams, organizationId };

                setIsLoading(true);
                const paginatedStudents = await fetchStudents(finalFilterParams);
                setData(paginatedStudents);

            } catch (error) {
                if (error instanceof Error) {
                    observableError.notify({ title: "Failed to fetch students", description: error.message });
                }
            } finally {
                setIsLoading(false);
            }
        };

        getStudents();
    }, [filterParams, organizationId]);

    return { data, isLoading };
}