import { KindePermissions } from "@kinde-oss/kinde-auth-nextjs";
import { KindeOrganization, KindeUser } from "@kinde-oss/kinde-auth-nextjs/server";
import { Classroom, Organization, Teacher } from "@prisma/client";
import { Server as NetServer, Socket } from "net";
import { NextApiResponse } from "next";
import { Server as SocketIOServer } from "socket.io";

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

enum ECallType {
    DEFAULT = "default",
    AUDIOROOM = "audio_room",
    LIVESTREAM = "livestream",
    DEVELOPMENT = "development"
}

type TCallType = "default" | "audio_room" | "livestream" | "development";

export { ECallType, NextApiResponseServerIo, TAttachmentLabel, TCallType, TDashboardAsideTab, TOrderBy, TOrganizationWithClassroomsWithStudentsWithTeachers, TPaginatedResponse, TRole, TUser, TUserSession };

