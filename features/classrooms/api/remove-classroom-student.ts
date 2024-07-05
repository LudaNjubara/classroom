"use server";

import { API_ENDPOINTS } from "@/constants";
import { handleError } from "@/utils/handle-error";
import { cookies } from "next/headers";
import { TDeleteClassroomStudentRequestBody } from "../types";

type TRemoveClassroomStudentParams = {
    classroomStudent: TDeleteClassroomStudentRequestBody;
};

export async function removeClassroomStudent({
    classroomStudent
}: TRemoveClassroomStudentParams) {
    const response = await fetch(API_ENDPOINTS.CLASSROOM.STUDENT.REMOVE, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            Cookie: cookies().toString(),
        },
        body: JSON.stringify({ classroomStudent }),
    });

    if (!response.ok) {
        handleError(response.status)
    }

    return response.json() as unknown as { message: string }
};