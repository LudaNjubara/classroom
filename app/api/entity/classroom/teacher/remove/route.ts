import { db } from "@/config";
import { TDeleteClassroomTeacherRequestBody } from "@/features/classrooms/types";
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
            classroomTeacher: TDeleteClassroomTeacherRequestBody;
        } = await request.json();

        if (!requestBody.classroomTeacher.classroomId) {
            return NextResponse.json({ error: "Request parameter 'classroomId' is invalid" }, { status: 400 })
        } else if (!requestBody.classroomTeacher.teacherId) {
            return NextResponse.json({ error: "Request parameter 'teacherId' is invalid" }, { status: 400 })
        }

        // check if the teacher is trying to remove himself from the classroom and prevent it
        const teacher = await db.teacher.findUnique({
            where: {
                id: requestBody.classroomTeacher.teacherId
            }
        });

        if (teacher?.profileId === profile.kindeId) {
            return NextResponse.json({ error: "As a teacher, you can't remove yourself from the classroom" }, {
                status: 403
            })
        }

        await db.classroomTeacher.delete({
            where: {
                classroomId_teacherId: {
                    classroomId: requestBody.classroomTeacher.classroomId,
                    teacherId: requestBody.classroomTeacher.teacherId
                }
            }
        });

        return NextResponse.json({ message: "Teacher successfuly removed from the classroom" }, { status: 200 })
    }

    catch (error) {
        console.log("error", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}