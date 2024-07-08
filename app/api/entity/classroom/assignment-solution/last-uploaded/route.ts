import { db } from "@/config";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { Role } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

type TAllowedRoles = Exclude<Role, "ADMIN" | "GUEST" | "TEACHER" | "ORGANIZATION">;

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

        const allowedRoles: TAllowedRoles[] = ["STUDENT"];

        if (!allowedRoles.includes(profile.role as TAllowedRoles)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { searchParams } = new URL(request.url);
        const assignmentId = searchParams.get("assignmentId");

        if (!assignmentId) {
            return NextResponse.json({ error: "Invalid query parameter 'assignmentId'" }, { status: 400 })
        }

        console.log("assignmentId", assignmentId)
        console.log("profile", profile)

        const assignmentSolution = await db.assignmentSolution.findFirst({
            where: {
                assignmentId,
                student: {
                    profileId: profile.kindeId
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        if (!assignmentSolution) {
            return NextResponse.json({ error: "Assignment solution not found" }, { status: 404 })
        }

        return NextResponse.json({ data: assignmentSolution }, { status: 200 })
    }

    catch (error) {
        console.log("error", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}