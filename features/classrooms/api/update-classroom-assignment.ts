"use server";

import { API_ENDPOINTS } from "@/constants";
import { ClassroomAssignment } from "@prisma/client";
import { cookies } from "next/headers";
import { TUpdateClassroomAssignmentParams } from "../types";

export async function updateClassroomAssignment(classroomAssignment: TUpdateClassroomAssignmentParams) {
    const response = await fetch(API_ENDPOINTS.CLASSROOM.ASSIGNMENT.UPDATE, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Cookie: cookies().toString(),
        },
        body: JSON.stringify({
            classroomAssignment
        }),
    });

    if (!response.ok) {
        const res = await response.json();

        throw new Error(res.error);
    }

    return response.json() as unknown as { classroomAssignment: ClassroomAssignment }
};