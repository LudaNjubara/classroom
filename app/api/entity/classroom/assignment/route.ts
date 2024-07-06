import { db } from "@/config";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { Role } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

type TAllowedRoles = Exclude<Role, "ADMIN" | "GUEST" | "STUDENT" | "ORGANIZATION">;

export async function POST(req: NextRequest) {
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

        const { classroomAssignment } = await req.json();
        const { classroomId, title, description, dueDate } = classroomAssignment;

        if (!classroomId || !title || !description || !dueDate) {
            return NextResponse.json({ error: "Invalid request" }, { status: 400 })
        }

        const teacher = await db.teacher.findFirst({
            where: {
                profileId: profile.kindeId
            }
        });

        if (!teacher) {
            return NextResponse.json({ error: "Teacher not found" }, { status: 404 })
        }

        const assignment = await db.classroomAssignment.create({
            data: {
                title,
                description,
                dueDate,
                teacher: {
                    connect: {
                        id: teacher.id
                    }
                },
                classroom: {
                    connect: {
                        id: classroomAssignment.classroomId
                    }
                }
            }
        });

        return NextResponse.json({ assignment }, { status: 201 })

    } catch (error) {
        console.log("error", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }

}