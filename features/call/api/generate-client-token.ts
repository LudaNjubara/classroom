"use server";

import { API_ENDPOINTS } from "@/constants";
import { cookies } from "next/headers";

export async function generateClientToken() {
    const response = await fetch(API_ENDPOINTS.CALL.GENERATE_TOKEN, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Cookie: cookies().toString(),
        },
    });

    if (!response.ok) {
        const res = await response.json() as { error: string }

        throw new Error(res.error)
    }

    const res = await response.json() as { token: string }

    return res.token;
};