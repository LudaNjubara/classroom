"use server"

import { API_ENDPOINTS } from "@/constants";
import { cookies } from "next/headers";
import { TAssignmentSolutionWithStudent } from "../types";

type TFetchClassroomAssignmentSolutionsProps = {
    assignmentId: string;
};

export async function fetchClassroomAssignmentSolutions({ assignmentId }: TFetchClassroomAssignmentSolutionsProps): Promise<{ data: TAssignmentSolutionWithStudent[] }> {
    const urlSearchParams = new URLSearchParams({ assignmentId });

    const response = await fetch(`${API_ENDPOINTS.CLASSROOM.ASSIGNMENT_SOLUTION.GET_ALL}?${urlSearchParams}`, {
        headers: { Cookie: cookies().toString() },
    });

    if (!response.ok) {
        const res = await response.json();

        throw new Error(res.error)
    }

    const data = await response.json();

    return data;
};