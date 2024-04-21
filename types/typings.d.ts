import { KindePermissions } from "@kinde-oss/kinde-auth-nextjs";
import { KindeOrganization, KindeUser } from "@kinde-oss/kinde-auth-nextjs/server";
import { Classroom, Organization, Teacher } from "@prisma/client";

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

export { TDashboardAsideTab, TOrderBy, TOrganizationWithClassroomsWithStudentsWithTeachers, TPaginatedResponse, TRole, TUser, TUserSession };

