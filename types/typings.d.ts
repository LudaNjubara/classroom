import { KindePermissions } from "@kinde-oss/kinde-auth-nextjs";
import { KindeOrganization, KindeUser } from "@kinde-oss/kinde-auth-nextjs/server";
import { Classroom, Organization, Teacher } from "@prisma/client";
import { Server as NetServer, Socket } from "net";
import { NextApiResponse } from "next";
import { Server as SocketIOServer } from "socket.io";
import { EAssignmentStatisticsEvent, EClassroomStatisticsEvent, ECommunicationStatisticsEvent } from "./enums";

type TPaginatedResponse<T> = {
    count: number;
    data: T[];
}

type TUserSession = {
    isAuthenticated: boolean;
    user: KindeUser;
    permissions: KindePermissions;
    organization: KindeOrganization;
}

type TUser = {
    id: string;
    name: string;
    email: string;
}

type TOrganizationWithClassroomsWithStudentsWithTeachers = Organization & {
    classrooms: Classroom[];
    teachers: Teacher[];
    students: Student[];
}

type TDashboardAsideTab = {
    classrooms: 'classrooms',
    teachers: 'teachers',
    students: 'students',
    notifications: 'notifications',
    community: 'community',
    settings: 'settings',
}

type TOrderBy = "asc" | "desc";

type TRole = "ADMIN" | "GUEST" | "ORGANIZATION" | "TEACHER" | "STUDENT"

type NextApiResponseServerIo = NextApiResponse & {
    socket: Socket & {
        server: NetServer & {
            io: SocketIOServer
        }
    }
}

type TAttachmentLabel = "File" | "Image" | "Video" | "Audio" | "Location" | "Contact";

type TStatisticsEventMetadata = {
    classroomId?: string;
    assignmentId?: string;
}

type TEventQueue = {
    event: EAssignmentStatisticsEvent | EClassroomStatisticsEvent | ECommunicationStatisticsEvent;
    data: any;
    metadata: TStatisticsEventMetadata;
}

export { NextApiResponseServerIo, TAttachmentLabel, TDashboardAsideTab, TEventQueue, TOrderBy, TOrganizationWithClassroomsWithStudentsWithTeachers, TPaginatedResponse, TRole, TStatisticsEventMetadata, TUser, TUserSession };

