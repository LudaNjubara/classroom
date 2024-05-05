import { db } from "@/config";
import { ERROR_MESSAGES } from "@/constants";
import { handleError } from "@/utils/handle-error";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { Role } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

type TAllowedRoles = Exclude<Role, "ADMIN" | "GUEST">;

const queryStrategies: {
    [key in TAllowedRoles]: (profileId: string) => Promise<any>;
} = {
    TEACHER: async (profileId: string) => {
        const teacher = await db.teacher.findFirst({
            where: {
                profileId
            }
        });

        if (!teacher) {
            handleError(ERROR_MESSAGES.CLIENT_ERROR.NOT_FOUND.CODE)
        }

        return teacher;
    },
    STUDENT: async (profileId: string) => {
        const student = await db.student.findFirst({
            where: {
                profileId
            }
        });

        if (!student) {
            handleError(ERROR_MESSAGES.CLIENT_ERROR.NOT_FOUND.CODE)
        }

        return student;
    },
    ORGANIZATION: async (profileId: string) => {
        console.log("profileId", profileId)
        const organization = await db.organization.findFirst({
            where: {
                profileId
            }
        });

        if (!organization) {
            handleError(ERROR_MESSAGES.CLIENT_ERROR.NOT_FOUND.CODE)
        }

        return organization;
    }
}

const constructWhereClause = (role: TAllowedRoles, tenantId: string, organizationId: string) => {
    let whereClause = {}

    switch (role) {
        case "TEACHER":
            whereClause = {
                teachers: {
                    some: {
                        teacherId: tenantId
                    }
                },
                organizationId
            }
            break;
        case "STUDENT":
            whereClause = {
                students: {
                    some: {
                        studentId: tenantId
                    }
                },
                organizationId
            }
            break;
        case "ORGANIZATION":
            whereClause = {
                organizationId: tenantId
            }
            break;
        default:
            const _exhaustiveCheck: never = role;
    }

    return whereClause;
}

export async function GET(request: NextRequest) {
    try {
        const { isAuthenticated, getUser } = getKindeServerSession();

        if (!await isAuthenticated()) {
            return NextResponse.json("Unauthorized", { status: 401 });
        }

        const user = await getUser();

        if (!user) {
            return NextResponse.json("Unauthorized", { status: 401 });
        }

        const profile = await db.profile.findUnique({
            where: {
                kindeId: user.id
            }
        });

        if (!profile) {
            return NextResponse.json({ error: "Profile not found" }, { status: 404 })
        }

        const allowedRoles: TAllowedRoles[] = ["STUDENT", "TEACHER", "ORGANIZATION"];

        if (!allowedRoles.includes(profile.role as TAllowedRoles)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { searchParams } = new URL(request.url);
        const organizationId = searchParams.get("organizationId");

        if (!organizationId) {
            return NextResponse.json({ error: "Invalid query parameter 'organizationId'" }, { status: 400 })
        }

        const tenant = await queryStrategies[profile!.role as TAllowedRoles](profile!.kindeId);

        const whereClause = constructWhereClause(
            profile.role as TAllowedRoles,
            tenant.id,
            organizationId
        );

        const classrooms = await db.classroom.findMany({
            where: whereClause,
            include: {
                settings: true,
            }
        });

        return NextResponse.json({ data: classrooms }, { status: 200 })
    }

    catch (error) {
        console.log("error", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}