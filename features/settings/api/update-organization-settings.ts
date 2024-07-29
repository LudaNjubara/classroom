"use server"

import { API_ENDPOINTS } from "@/constants";
import { TUpdateOrganizationSettingsRequestBody } from "@/features/settings/types";
import { OrganizationSettings } from "@prisma/client";
import { cookies } from "next/headers";

type TFetchOrganizationSettingsProps = {
    organizationSettings: TUpdateOrganizationSettingsRequestBody;
};

export async function updateOrganizationSettings({ organizationSettings }: TFetchOrganizationSettingsProps): Promise<{ data: OrganizationSettings[] }> {

    const response = await fetch(API_ENDPOINTS.ORGANIZATION.SETTINGS.UPDATE, {
        method: "PUT",
        headers: { Cookie: cookies().toString() },
        body: JSON.stringify({ organizationSettings }),
    });

    if (!response.ok) {
        const res = await response.json();

        throw new Error(res.error)
    }

    const data = await response.json();

    return data;
};