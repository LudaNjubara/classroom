"use server";

import { API_ENDPOINTS } from "@/constants";
import { TSelectedStudentItem } from "@/features/students";
import { TSelectedTeacherItem } from "@/features/teachers";
import { handleError } from "@/utils/handle-error";
import { Classroom } from "@prisma/client";
import { cookies } from "next/headers";
import { TScheduleItem } from "../types";

type TCreateClassroomParams = {
    studentItems: TSelectedStudentItem[];
    teacherItems: TSelectedTeacherItem[];
    scheduleItems: TScheduleItem[];
    organizationId: string;
    classroom: {
        name: string;
        description: string;
    };
};

export async function createClassroom({
    studentItems,
    teacherItems,
    scheduleItems,
    organizationId,
    classroom
}: TCreateClassroomParams) {
    const response = await fetch(API_ENDPOINTS.CLASSROOM.CREATE, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Cookie: cookies().toString(),
        },
        body: JSON.stringify({
            studentItems,
            teacherItems,
            scheduleItems,
            organizationId,
            classroom
        }),
    });

    if (!response.ok) {
        handleError(response.status)
    }

    return response.json() as unknown as { classroom: Classroom }
};