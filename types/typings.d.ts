import { KindePermissions } from "@kinde-oss/kinde-auth-nextjs";
import { KindeOrganization, KindeUser } from "@kinde-oss/kinde-auth-nextjs/server";
import { Classroom, Organization, Profile, Teacher } from "@prisma/client";

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

type TTeacherWithProfile = Teacher & {
    profile: Profile;
}

type TTeacherSearchBy = Omit<Teacher, "id" | "organizationId" | "profileId" | "createdAt" | "updatedAt">;

type TCountry = {
    name: {
        common: string;
    },
    cca2: string;
    flags: {
        png: string;
        svg: string;
    }
}

type TDashboardAsideTab = {
    classrooms: 'classrooms',
    teachers: 'teachers',
    students: 'students',
    notifications: 'notifications',
    settings: 'settings',
}

type TOrderBy = "asc" | "desc";

type TTeachersFetchFilterParams = {
    from?: number;
    take?: number;
    query?: string;
    searchBy?: (keyof TTeacherSearchBy)[];
    orderBy?: TOrderBy;
}


type TRole = "ADMIN" | "GUEST" | "ORGANIZATION" | "TEACHER" | "STUDENT"

export { TCountry, TDashboardAsideTab, TOrderBy, TOrganizationWithClassroomsWithStudentsWithTeachers, TPaginatedResponse, TRole, TTeacherSearchBy, TTeacherWithProfile, TTeachersFetchFilterParams, TUser, TUserSession };

