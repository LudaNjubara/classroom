import { Classroom, ClassroomChannel, ClassroomSetting, ClassroomSettings, Message, Resource, ResourcesMetadata, Role, SettingType, Student, Teacher } from "@prisma/client";

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
        channelId?: string;
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

export type TClassroomWithChannels = Classroom & {
    channels: ClassroomChannel[];
}

export type TAccentColor = {
    dark: string;
    darker: string;
    base: string;
    light: string;
    lighter: string;
}

export type TChannelRequest = {
    name: string;
    metadata: {
        classroomId: string;
        organizationId: string;
    }
}

export type TFileUploadResponseWithFilename = TFileUploadResponse & { filename: string };

export type TMessageWithSender = Message & {
    senderData: Teacher | Student;
}

export type TResourceWithMetadata = Resource & {
    metadata: ResourcesMetadata;
}

export type TClassroomSettingsItemType = "general" | "members" | "resources" | "customization";

export type TClassroomSettingsItem = {
    id: TClassroomSettingsItemType;
    title: string;
    description: string;
    icon: JSX.Element;
}

export type TUpdateClassroomRequestBody = Omit<Classroom, "organizationId" | "createdAt" | "updatedAt">

export type TClassroomSettingsWithId = {
    [key in ClassroomSetting]?: {
        id: string;
        value: string;
        metadata: {
            type: SettingType;
        }
    }
}

export type TUpdateClassroomSettingsRequestBody = {
    settings: TClassroomSettingsWithId;
    classroomId: string;
}

export type TUpdateClassroomTeachersRequestBody = {
    teachers: string[];
    classroomId: string;
}

export type TUpdateClassroomStudentsRequestBody = {
    students: string[];
    classroomId: string;
}

export type TUpdateClassroomParams = {
    classroom?: TUpdateClassroomRequestBody;
    resources?: TFileUploadResponseWithFilename[]
    classroomSettings?: TUpdateClassroomSettingsRequestBody;
    classroomTeachers?: TUpdateClassroomTeachersRequestBody;
    classroomStudents?: TUpdateClassroomStudentsRequestBody;
};

export type TDeleteClassroomStudentRequestBody = {
    studentId: string;
    classroomId: string;
}

export type TDeleteClassroomTeacherRequestBody = {
    teacherId: string;
    classroomId: string;
}