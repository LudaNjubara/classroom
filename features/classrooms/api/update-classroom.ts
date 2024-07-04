"use server";

import { API_ENDPOINTS } from "@/constants";
import { handleError } from "@/utils/handle-error";
import { Classroom } from "@prisma/client";
import { cookies } from "next/headers";
import { TUpdateClassroomParams } from "../types";

export async function updateClassroom({ resources, classroom, classroomSettings, classroomTeachers, classroomStudents }: TUpdateClassroomParams) {
    const response = await fetch(API_ENDPOINTS.CLASSROOM.UPDATE, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Cookie: cookies().toString(),
        },
        body: JSON.stringify({
            resources,
            classroom,
            classroomSettings,
            classroomTeachers,
            classroomStudents
        }),
    });

    if (!response.ok) {
        handleError(response.status)
    }

    return response.json() as unknown as { classroom: Classroom }
};