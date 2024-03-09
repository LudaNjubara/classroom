"use server"

import { TTeacherWithProfile, TTeachersFetchFilterParams } from "@/types/typings";
import { cookies } from "next/headers";
import { API_ENDPOINTS } from "../constants/api-constants";

const fetchTeachers = async (filterParams: TTeachersFetchFilterParams | undefined): Promise<TTeacherWithProfile[]> => {
    const params = {
        ...filterParams,
        searchBy: filterParams?.searchBy?.join(",") ?? "",
        from: filterParams?.from?.toString() ?? "",
    }

    const urlSearchParams = new URLSearchParams(params).toString();

    const response = await fetch(`${API_ENDPOINTS.TEACHER}?${urlSearchParams}`, {
        headers: { Cookie: cookies().toString() },
    });

    if (!response.ok) {
        throw new Error("There was an error fetching teachers. Please try again.");
    }

    const { teachers } = await response.json();

    return teachers;
};

export default fetchTeachers;