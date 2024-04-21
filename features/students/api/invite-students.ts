"use server"

import { API_ENDPOINTS } from "@/constants";
import { handleError } from "@/utils/handle-error";
import { cookies } from "next/headers";
import { TSelectedStudentItem } from "../types";

export async function inviteStudents(studentItems: TSelectedStudentItem[]) {
    const response = await fetch(API_ENDPOINTS.NOTIFICATION.INVITE_STUDENTS, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Cookie: cookies().toString(),
        },
        body: JSON.stringify({ studentItems }),
    });

    if (!response.ok) {
        handleError(response.status)
    }
};