"use server";

import { API_ENDPOINTS } from "@/constants";
import { TSelectedStudentItem } from "@/features/students";
import { TSelectedTeacherItem } from "@/features/teachers";
import { Classroom } from "@prisma/client";
import { cookies } from "next/headers";
import { TClassroomSettings, TScheduleItem } from "../types";

type TCreateClassroomParams = {
    studentItems: TSelectedStudentItem[];
    teacherItems: TSelectedTeacherItem[];
    classroomSettings?: TClassroomSettings;
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
    classroomSettings,
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
            classroomSettings,
            scheduleItems,
            organizationId,
            classroom
        }),
    });

    if (!response.ok) {
        const res = await response.json() as { error: string }

        throw new Error(res.error)
    }

    return response.json() as unknown as { classroom: Classroom }
};