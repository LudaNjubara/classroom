"use server";

import { API_ENDPOINTS } from "@/constants";
import { AssignmentSolution } from "@prisma/client";
import { cookies } from "next/headers";
import { TCreateClassroomAssignmentSolutionRequestBody } from "../types";

export async function createAssignmentSolution(
    classroomAssignmentSolution
        : TCreateClassroomAssignmentSolutionRequestBody) {
    const response = await fetch(API_ENDPOINTS.CLASSROOM.ASSIGNMENT_SOLUTION.CREATE, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Cookie: cookies().toString(),
        },
        body: JSON.stringify({ classroomAssignmentSolution }),
    });

    if (!response.ok) {
        const res = await response.json();

        throw new Error(res.error)
    }

    return response.json() as unknown as { assignmentSolution: AssignmentSolution }
};