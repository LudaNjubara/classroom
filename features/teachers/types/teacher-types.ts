import { TOrderBy } from "@/types/typings";
import { Profile, Teacher } from "@prisma/client";

export type TSelectedTeacherItem = {
    teacherId: string;
    inviteMessage?: string;
}

export type TTeacherWithProfile = Teacher & {
    profile: Profile;
}

export type TTeacherSearchBy = Omit<Teacher, "id" | "profileId" | "createdAt" | "updatedAt">;

export type TTeachersFetchFilterParams = {
    from?: number;
    take?: number;
    query?: string;
    searchBy?: (keyof TTeacherSearchBy)[];
    orderBy?: TOrderBy;
}