import { db } from "@/config";
import { TDeleteClassroomAssignmentRequestBody } from "@/features/classrooms/types";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { Role } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

type TAllowedRoles = Exclude<Role, "ADMIN" | "STUDENT" | "GUEST" | "ORGANIZATION">;

export async function DELETE(request: NextRequest) {
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

        const allowedRoles: TAllowedRoles[] = ["TEACHER"];

        if (!allowedRoles.includes(profile.role as TAllowedRoles)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const requestBody: {
            classroomAssignment: TDeleteClassroomAssignmentRequestBody;
        } = await request.json();

        if (!requestBody.classroomAssignment.assignmentId) {
            return NextResponse.json({ error: "Request parameter 'assignmentId' is invalid" }, { status: 400 })
        }

        const classroomAssignment = await db.classroomAssignment.delete({
            where: {
                id: requestBody.classroomAssignment.assignmentId
            }
        });

        if (!classroomAssignment) {
            return NextResponse.json({ error: "Assignment not found" }, { status: 404 })
        }

        return NextResponse.json({ message: "Assignment successfuly revoked" }, { status: 200 })
    }

    catch (error) {
        console.log("error", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}