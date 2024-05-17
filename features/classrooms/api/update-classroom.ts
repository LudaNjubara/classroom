"use server";

import { API_ENDPOINTS } from "@/constants";
import { Classroom } from "@prisma/client";
import { cookies } from "next/headers";
import { TFileUploadResponseWithFilename } from "../types";

type TUpdateClassroomParams = {
    resources?: TFileUploadResponseWithFilename[]
};

export async function updateClassroom(
    { resources }
        : TUpdateClassroomParams) {
    const response = await fetch(API_ENDPOINTS.CLASSROOM.UPDATE, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Cookie: cookies().toString(),
        },
        body: JSON.stringify({
            resources
        }),
    });

    return response.json() as unknown as { classroom: Classroom }
};