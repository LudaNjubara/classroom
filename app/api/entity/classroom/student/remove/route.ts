import { db } from "@/config";
import { TDeleteClassroomStudentRequestBody } from "@/features/classrooms/types";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { Role } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

type TAllowedRoles = Exclude<Role, "ADMIN" | "STUDENT" | "GUEST">;

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

        const allowedRoles: TAllowedRoles[] = ["TEACHER", "ORGANIZATION"];

        if (!allowedRoles.includes(profile.role as TAllowedRoles)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const requestBody: {
            classroomStudent: TDeleteClassroomStudentRequestBody;
        } = await request.json();

        if (!requestBody.classroomStudent.classroomId) {
            return NextResponse.json({ error: "Request parameter 'classroomId' is invalid" }, { status: 400 })
        } else if (!requestBody.classroomStudent.studentId) {
            return NextResponse.json({ error: "Request parameter 'studentId' is invalid" }, { status: 400 })
        }

        await db.classroomStudent.delete({
            where: {
                classroomId_studentId: {
                    classroomId: requestBody.classroomStudent.classroomId,
                    studentId: requestBody.classroomStudent.studentId
                }
            }
        });

        return NextResponse.json({ message: "Student successfuly removed from the classroom" }, { status: 200 })
    }

    catch (error) {
        console.log("error", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}