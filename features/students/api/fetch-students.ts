"use server"

import { TPaginatedResponse } from "@/types/typings";
import { handleError } from "@/utils/handle-error";
import { cookies } from "next/headers";
import { API_ENDPOINTS } from "../../../constants/api-constants";
import { TStudentWithProfile, TStudentsFetchFilterParams } from "../types";

export async function fetchStudents(filterParams: TStudentsFetchFilterParams | undefined): Promise<TPaginatedResponse<TStudentWithProfile>> {
    const params = {
        ...filterParams,
        searchBy: filterParams?.searchBy?.join(",") ?? "",
        from: filterParams?.from?.toString() ?? "",
        take: filterParams?.take?.toString() ?? "",
    }

    const urlSearchParams = new URLSearchParams(params).toString();

    const response = await fetch(`${API_ENDPOINTS.STUDENT}?${urlSearchParams}`, {
        headers: { Cookie: cookies().toString() },
    });

    if (!response.ok) {
        handleError(response.status)
    }

    const data = await response.json();

    return data;
};