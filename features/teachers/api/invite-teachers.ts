"use server"

import { handleError } from "@/utils/handle-error";
import { cookies } from "next/headers";
import { TSelectedTeacherItem } from "..";
import { API_ENDPOINTS } from "../../../constants/api-constants";

export async function inviteTeachers(teacherItems: TSelectedTeacherItem[]) {
    const response = await fetch(API_ENDPOINTS.NOTIFICATION.INVITE_TEACHERS, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Cookie: cookies().toString(),
        },
        body: JSON.stringify({ teacherItems }),
    });

    if (!response.ok) {
        handleError(response.status)
    }
};