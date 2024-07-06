"use server";

import { API_ENDPOINTS } from "@/constants";
import { Classroom } from "@prisma/client";
import { cookies } from "next/headers";
import { TCreateClassroomAssignmentRequestBody } from "../types";

export async function createClassroomAssignment(
    classroomAssignment
        : TCreateClassroomAssignmentRequestBody) {
    const response = await fetch(API_ENDPOINTS.CLASSROOM.ASSIGNMENT.CREATE, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Cookie: cookies().toString(),
        },
        body: JSON.stringify({ classroomAssignment }),
    });

    if (!response.ok) {
        const res = await response.json();

        throw new Error(res.error)
    }

    return response.json() as unknown as { classroom: Classroom }
};