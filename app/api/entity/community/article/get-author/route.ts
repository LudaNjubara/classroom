import { db } from "@/config";
import { isInEnum } from "@/utils/misc";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { ArticleUserType, Role } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

type TAllowedRoles = Exclude<Role, "ADMIN" | "GUEST">;

const queryStrategies: {
    [key in TAllowedRoles]: (profileId: string) => Promise<any>
} = {
    TEACHER: async (profileId: string) => {
        const teacher = await db.teacher.findFirst({
            where: {
                id: profileId
            }
        });

        if (!teacher) return null

        return teacher;
    },
    STUDENT: async (profileId: string) => {
        const student = await db.student.findFirst({
            where: {
                id: profileId
            }
        });

        if (!student) return null

        return student;
    },
    ORGANIZATION: async (profileId: string) => {
        const organization = await db.organization.findFirst({
            where: {
                id: profileId
            }
        });

        if (!organization) return null

        return organization;
    }
}

export async function GET(req: NextRequest) {
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

        const allowedRoles: TAllowedRoles[] = ["TEACHER", "ORGANIZATION", "STUDENT"];

        if (!allowedRoles.includes(profile.role as TAllowedRoles)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { searchParams } = new URL(req.url);
        const authorId = searchParams.get('authorId');
        const authorRole = searchParams.get('authorRole') as ArticleUserType;

        if (!authorId || !authorRole || !isInEnum(ArticleUserType, authorRole)) {
            return NextResponse.json({ error: "Invalid request" }, { status: 400 });
        }

        const tenant = await queryStrategies[authorRole as TAllowedRoles](authorId);

        if (!tenant) {
            return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
        }

        const tenantProfile = await db.profile.findUnique({
            where: {
                kindeId: tenant.profileId,
            }
        });

        if (!tenantProfile) {
            return NextResponse.json({ error: "Tenant profile not found" }, { status: 404 });
        }

        const tenantWithProfile = {
            ...tenant,
            profile: tenantProfile
        }

        return NextResponse.json({ data: tenantWithProfile }, { status: 201 });
    }

    catch (error) {
        console.log("error", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}