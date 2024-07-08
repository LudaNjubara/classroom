import { db } from "@/config";
import { TCreateClassroomAssignmentSolutionRequestBody } from "@/features/classrooms/types";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { Role } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

type TAllowedRoles = Exclude<Role, "ADMIN" | "GUEST" | "ORGANIZATION" | "TEACHER">;

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

        const allowedRoles: TAllowedRoles[] = ["STUDENT"];

        if (!allowedRoles.includes(profile.role as TAllowedRoles)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { classroomAssignmentSolution }: { classroomAssignmentSolution: TCreateClassroomAssignmentSolutionRequestBody } = await req.json();
        const { assignmentId, note, resources } = classroomAssignmentSolution;

        if (!assignmentId || !resources.length) {
            return NextResponse.json({ error: "Invalid request" }, { status: 400 })
        }

        const student = await db.student.findFirst({
            where: {
                profileId: profile.kindeId
            }
        });

        if (!student) {
            return NextResponse.json({ error: "Student not found" }, { status: 404 })
        }

        const files = resources.map(resource => ({
            name: resource.filename,
            size: resource.size,
            url: resource.url
        }));

        const solution = await db.assignmentSolution.create({
            data: {
                note: note || null,
                status: "SUBMITTED",
                files: {
                    createMany: {
                        data: files
                    }
                },
                student: {
                    connect: {
                        id: student.id
                    }
                },
                assignment: {
                    connect: {
                        id: assignmentId
                    }
                },
            }
        });

        return NextResponse.json({ assignmentSolution: solution }, { status: 201 })

    } catch (error) {
        console.log("error", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }

}