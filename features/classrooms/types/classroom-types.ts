import { Classroom, ClassroomSetting, ClassroomSettings, Role, SettingType } from "@prisma/client";

export type TDay = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";
export type TScheduleTime = "12:00" | "12:30" | "1:00" | "1:30" | "2:00" | "2:30" | "3:00" | "3:30" | "4:00" | "4:30" | "5:00" | "5:30" | "6:00" | "6:30" | "7:00" | "7:30" | "8:00" | "8:30" | "9:00" | "9:30" | "10:00" | "10:30" | "11:00" | "11:30";

export type TScheduleItem = {
    id: string;
    day: TDay;
    startTime: TScheduleTime;
    endTime: TScheduleTime;
    startTimeAmPm: "AM" | "PM";
    endTimeAmPm: "AM" | "PM";
}

export type TFileUploadResponse = {
    url: string;
    size: number;
    uploadedAt: Date;
    metadata: {
        profileId: string;
        userId: string;
        userRole: Role;
        classroomId?: string;
    };
    path: Record<string, never>;
    pathOrder: string[];
}

export enum EClassroomSettings {
    AccentColor = "accentColor",
}

export type TClassroomSettings = {
    [key in ClassroomSetting]?: {
        value: string;
        metadata: {
            type: SettingType;
        }
    }
}

export type TClassroomWithSettings = Classroom & {
    settings: ClassroomSettings[];
}

export type TAccentColor = {
    dark: string;
    darker: string;
    base: string;
    light: string;
    lighter: string;
}

export type TFileUploadResponseWithFilename = TFileUploadResponse & { filename: string };