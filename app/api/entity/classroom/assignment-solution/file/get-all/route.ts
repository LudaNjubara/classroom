import { db } from "@/config";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { Role } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

type TAllowedRoles = Exclude<Role, "ADMIN" | "GUEST">;

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

        const allowedRoles: TAllowedRoles[] = ["TEACHER", "STUDENT", "ORGANIZATION"];

        if (!allowedRoles.includes(profile.role as TAllowedRoles)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { searchParams } = new URL(request.url);
        const solutionId = searchParams.get("solutionId");

        if (!solutionId) {
            return NextResponse.json({ error: "Invalid query parameter 'solutionId'" }, { status: 400 })
        }

        const classroomAssignmentSolutionFiles = await db.assignmentSolutionFile.findMany({
            where: {
                solutionId
            },
            orderBy: {
                name: "asc"
            },
        });

        return NextResponse.json({ data: classroomAssignmentSolutionFiles }, { status: 200 })
    }

    catch (error) {
        console.log("error", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}