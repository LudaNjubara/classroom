"use server"

import { API_ENDPOINTS } from "@/constants";
import { handleError } from "@/utils/handle-error";
import { cookies } from "next/headers";
import { TClassroomAssignmentWithTeacher } from "../types";

type TFetchClassroomAssignmentsProps = {
    classroomId: string;
};

export async function fetchClassroomAssignments({ classroomId }: TFetchClassroomAssignmentsProps): Promise<{ data: TClassroomAssignmentWithTeacher[] }> {
    const urlSearchParams = new URLSearchParams({ classroomId });

    const response = await fetch(`${API_ENDPOINTS.CLASSROOM.ASSIGNMENT.GET_ALL}?${urlSearchParams}`, {
        headers: { Cookie: cookies().toString() },
    });

    if (!response.ok) {
        handleError(response.status)
    }

    const data = await response.json();

    return data;
};