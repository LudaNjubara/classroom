import { KindePermissions } from "@kinde-oss/kinde-auth-nextjs";
import { KindeOrganization, KindeUser } from "@kinde-oss/kinde-auth-nextjs/server";
import { Classroom, Organization, Profile, Teacher } from "@prisma/client";

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
    settings: 'settings',
}

type TOrder = "asc" | "desc";

type TTeachersFetchFilterParams = Partial<Teacher> & {
    from?: number;
    orderBy?: keyof Teacher;
    order?: TOrder;
}


type TRole = "ADMIN" | "GUEST" | "ORGANIZATION" | "TEACHER" | "STUDENT"

export { TCountry, TDashboardAsideTab, TOrganizationWithClassroomsWithStudentsWithTeachers, TRole, TTeacherWithProfile, TTeachersFetchFilterParams, TUser, TUserSession };

