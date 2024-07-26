"use server"

import { API_ENDPOINTS } from "@/constants";
import { OrganizationSettings } from "@prisma/client";
import { cookies } from "next/headers";

type TFetchOrganizationSettingsProps = {
    organizationId: string;
};

export async function fetchOrganizationSettings({ organizationId }: TFetchOrganizationSettingsProps): Promise<{ data: OrganizationSettings[] }> {
    const urlSearchParams = new URLSearchParams({ organizationId });

    const response = await fetch(`${API_ENDPOINTS.ORGANIZATION.SETTINGS.GET}?${urlSearchParams}`, {
        headers: { Cookie: cookies().toString() },
    });

    if (!response.ok) {
        const res = await response.json();

        throw new Error(res.error)
    }

    const data = await response.json();

    return data;
};