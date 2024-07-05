"use server"

import { API_ENDPOINTS } from "@/constants";
import { handleError } from "@/utils/handle-error";
import { Teacher } from "@prisma/client";
import { cookies } from "next/headers";

type TFetchClassroomStudentsProps = {
    classroomId: string;
};

export async function fetchClassroomStudents({ classroomId }: TFetchClassroomStudentsProps): Promise<{ data: Teacher[] }> {
    const urlSearchParams = new URLSearchParams({ classroomId });

    const response = await fetch(`${API_ENDPOINTS.CLASSROOM.STUDENT.GET_ALL}?${urlSearchParams}`, {
        headers: { Cookie: cookies().toString() },
    });

    if (!response.ok) {
        handleError(response.status)
    }

    const data = await response.json();

    return data;
};