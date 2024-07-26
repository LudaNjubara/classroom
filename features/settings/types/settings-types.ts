import { OrganizationSetting, SettingType } from "@prisma/client";

export type TOrganizationSettings = {
    [key in OrganizationSetting]?: {
        value: string;
        metadata: {
            type: SettingType;
        }
    }
}

export type TOrganizationSettingsWithId = {
    [key in OrganizationSetting]?: {
        id: string;
        value: string;
        metadata: {
            type: SettingType;
        }
    }
}

export type TUpdateOrganizationSettingsRequestBody = {
    settings: TOrganizationSettingsWithId;
    organizationId: string;
}