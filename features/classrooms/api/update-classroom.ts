"use server";

import { API_ENDPOINTS } from "@/constants";
import { handleError } from "@/utils/handle-error";
import { Classroom } from "@prisma/client";
import { cookies } from "next/headers";
import { TFileUploadResponseWithFilename, TUpdateClassroomRequestBody } from "../types";

type TUpdateClassroomParams = {
    classroom?: TUpdateClassroomRequestBody;
    resources?: TFileUploadResponseWithFilename[];
};

export async function updateClassroom(
    { resources, classroom }
        : TUpdateClassroomParams) {
    const response = await fetch(API_ENDPOINTS.CLASSROOM.UPDATE, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Cookie: cookies().toString(),
        },
        body: JSON.stringify({
            resources,
            classroom,
        }),
    });

    if (!response.ok) {
        handleError(response.status)
    }

    return response.json() as unknown as { classroom: Classroom }
};