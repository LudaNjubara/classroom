"use server"

import { TTeacherWithProfile, TTeachersFetchFilterParams } from "@/types/typings";
import { cookies } from "next/headers";
import { API_ENDPOINTS } from "../constants/api-constants";
import { handleError } from "../helpers/handle-error";

const fetchTeachers = async (filterParams: TTeachersFetchFilterParams): Promise<TTeacherWithProfile[]> => {
    const urlSearchParams = new URLSearchParams(filterParams as Record<string, string>);

    const response = await fetch(`${API_ENDPOINTS.TEACHER}?${urlSearchParams}`, {
        headers: { Cookie: cookies().toString() },
    });

    if (!response.ok) {
        handleError(response.status);
    }

    const { teachers } = await response.json();

    return teachers;
};

export default fetchTeachers;