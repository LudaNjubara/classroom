"use server"

import { API_ENDPOINTS } from "@/constants";
import { AssignmentSolution } from "@prisma/client";
import { cookies } from "next/headers";

type TFetchLastUploadedClassroomAssignmentSolutionProps = {
    assignmentId: string;
};

export async function fetchLastUploadedClassroomAssignmentSolution({ assignmentId }: TFetchLastUploadedClassroomAssignmentSolutionProps): Promise<{ data: AssignmentSolution }> {
    const urlSearchParams = new URLSearchParams({ assignmentId });

    const response = await fetch(`${API_ENDPOINTS.CLASSROOM.ASSIGNMENT_SOLUTION.GET_LAST_UPLOADED}?${urlSearchParams}`, {
        headers: { Cookie: cookies().toString() },
    });

    if (!response.ok) {
        const res = await response.json();

        throw new Error(res.error)
    }

    const data = await response.json();

    return data;
};