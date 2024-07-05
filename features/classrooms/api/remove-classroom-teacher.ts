"use server";

import { API_ENDPOINTS } from "@/constants";
import { cookies } from "next/headers";
import { TDeleteClassroomTeacherRequestBody } from "../types";

type TRemoveClassroomTeacherParams = {
    classroomTeacher: TDeleteClassroomTeacherRequestBody;
};

export async function removeClassroomTeacher({
    classroomTeacher
}: TRemoveClassroomTeacherParams) {
    const response = await fetch(API_ENDPOINTS.CLASSROOM.TEACHER.REMOVE, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            Cookie: cookies().toString(),
        },
        body: JSON.stringify({ classroomTeacher }),
    });

    if (!response.ok) {
        const resData = await response.json();
        throw new Error(await resData.error)
    }

    return response.json() as unknown as { message: string }
};