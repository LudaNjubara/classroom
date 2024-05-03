"use server"

import { API_ENDPOINTS } from "@/constants";
import { handleError } from "@/utils/handle-error";
import { cookies } from "next/headers";
import { TClassroomWithSettings } from "../types";

export async function fetchClassrooms(): Promise<{ data: TClassroomWithSettings[] }> {

    const response = await fetch(API_ENDPOINTS.CLASSROOM.GET_ALL, {
        headers: { Cookie: cookies().toString() },
    });

    if (!response.ok) {
        handleError(response.status)
    }

    const data = await response.json();

    return data;
};