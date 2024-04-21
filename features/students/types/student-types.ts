import { TOrderBy } from "@/types/typings";
import { Profile, Student } from "@prisma/client";

export type TSelectedStudentItem = {
    studentId: string;
    inviteMessage?: string;
}

export type TStudentWithProfile = Student & {
    profile: Profile;
}

export type TStudentSearchBy = Omit<Student, "id" | "profileId" | "createdAt" | "updatedAt">;

export type TStudentsFetchFilterParams = {
    from?: number;
    take?: number;
    query?: string;
    searchBy?: (keyof TStudentSearchBy)[];
    orderBy?: TOrderBy;
}