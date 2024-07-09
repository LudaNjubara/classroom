"use server";

import { API_ENDPOINTS } from "@/constants";
import { cookies } from "next/headers";
import { TDeleteClassroomAssignmentRequestBody } from "../types";

type TRemoveClassroomAssignmentParams = {
    classroomAssignment: TDeleteClassroomAssignmentRequestBody;
};

export async function removeClassroomAssignment(
    { classroomAssignment }
        : TRemoveClassroomAssignmentParams) {
    const response = await fetch(API_ENDPOINTS.CLASSROOM.ASSIGNMENT.REMOVE, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            Cookie: cookies().toString(),
        },
        body: JSON.stringify({ classroomAssignment }),
    });

    if (!response.ok) {
        const resData = await response.json();
        throw new Error(await resData.error)
    }

    return response.json() as unknown as { message: string }
};