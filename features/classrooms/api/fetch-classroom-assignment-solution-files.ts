"use server"

import { API_ENDPOINTS } from "@/constants";
import { AssignmentSolutionFile } from "@prisma/client";
import { cookies } from "next/headers";

type TFetchClassroomAssignmentSolutionFilesProps = {
    solutionId: string;
};

export async function fetchClassroomAssignmentSolutionFiles({ solutionId }: TFetchClassroomAssignmentSolutionFilesProps): Promise<{ data: AssignmentSolutionFile[] }> {
    const urlSearchParams = new URLSearchParams({ solutionId });

    const response = await fetch(`${API_ENDPOINTS.CLASSROOM.ASSIGNMENT_SOLUTION.FILE.GET_ALL}?${urlSearchParams}`, {
        headers: { Cookie: cookies().toString() },
    });

    if (!response.ok) {
        const res = await response.json();

        throw new Error(res.error)
    }

    const data = await response.json();

    return data;
};