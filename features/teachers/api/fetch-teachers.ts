"use server"

import { API_ENDPOINTS } from "@/constants";
import { TPaginatedResponse } from "@/types/typings";
import { handleError } from "@/utils/handle-error";
import { cookies } from "next/headers";
import { TTeacherWithProfile, TTeachersFetchFilterParams } from "../types";

export async function fetchTeachers(filterParams: TTeachersFetchFilterParams | undefined): Promise<TPaginatedResponse<TTeacherWithProfile>> {
    const params = {
        ...filterParams,
        searchBy: filterParams?.searchBy?.join(",") ?? "",
        from: filterParams?.from?.toString() ?? "",
        take: filterParams?.take?.toString() ?? "",
    }

    const urlSearchParams = new URLSearchParams(params).toString();

    const response = await fetch(`${API_ENDPOINTS.TEACHER}?${urlSearchParams}`, {
        headers: { Cookie: cookies().toString() },
    });

    if (!response.ok) {
        handleError(response.status)
    }

    const data = await response.json();

    return data;
};