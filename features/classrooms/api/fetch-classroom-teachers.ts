"use server"


import { API_ENDPOINTS } from "@/constants";
import { handleError } from "@/utils/handle-error";
import { Teacher } from "@prisma/client";
import { cookies } from "next/headers";

type TFetchClassroomTeachersProps = {
    classroomId: string;
};

export async function fetchClassroomTeachers({ classroomId }: TFetchClassroomTeachersProps): Promise<{ data: Teacher[] }> {
    const urlSearchParams = new URLSearchParams({ classroomId });

    const response = await fetch(`${API_ENDPOINTS.CLASSROOM.TEACHER.GET_ALL}?${urlSearchParams}`, {
        headers: { Cookie: cookies().toString() },
    });

    if (!response.ok) {
        handleError(response.status)
    }

    const data = await response.json();

    return data;
};