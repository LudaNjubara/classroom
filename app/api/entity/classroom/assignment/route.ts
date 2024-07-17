import { db } from "@/config";
import { TUpdateClassroomAssignmentParams, TUpdateClassroomAssignmentRequestBody, TUpdateClassroomAssignmentResourcesRequestBody } from "@/features/classrooms/types";
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

        if (!assignment) {
            return NextResponse.json({ error: "Error creating assignment" }, { status: 500 })
        }

        const assignmentStatistics = await db.assignmentStatistics.create({
            data: {
                assignment: {
                    connect: {
                        id: assignment.id
                    }
                }
            }
        });

        if (!assignmentStatistics) {
            return NextResponse.json({ error: "Error creating assignment" }, { status: 500 })
        }

        return NextResponse.json({ assignment }, { status: 201 })

    } catch (error) {
        console.log("error", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }

}

type TWhereClauseParams = {
    classroomAssignment?: TUpdateClassroomAssignmentRequestBody;
    assignmentResources?: TUpdateClassroomAssignmentResourcesRequestBody;
};

type TWhereClause = {
    id: string;
};

const contructWhereClause = ({ classroomAssignment, assignmentResources }: TWhereClauseParams): TWhereClause => {
    let whereClause = { id: "" };

    if (classroomAssignment) {
        whereClause = {
            ...whereClause,
            id: classroomAssignment.id
        }
    }

    if (assignmentResources) {
        whereClause = {
            ...whereClause,
            id: assignmentResources.assignmentId
        }
    }

    return whereClause;
}

export async function PUT(req: NextRequest) {
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

        const requestBody = await req.json() as TUpdateClassroomAssignmentParams;

        // Prepare data for update
        const data: any = {};

        for (const key in requestBody) {
            if (requestBody.hasOwnProperty(key)) {
                switch (key) {
                    case 'assignmentResources':
                        data.resources = {
                            create: requestBody.assignmentResources!.resources.map((resource) => ({
                                url: resource.url,
                                name: resource.filename,
                                size: resource.size,
                                classroom: {
                                    connect: {
                                        id: resource.metadata.classroomId
                                    }
                                },
                                metadata: {
                                    create: {
                                        profileId: resource.metadata.profileId,
                                        userId: resource.metadata.userId,
                                        userRole: resource.metadata.userRole,
                                        classroomId: resource.metadata.classroomId,
                                        assignmentId: resource.metadata.assignmentId,
                                    }
                                }
                            }))
                        };
                        break;
                    case 'classroomAssignment':
                        data.title = requestBody.classroomAssignment!.title;
                        data.description = requestBody.classroomAssignment!.description;
                        data.dueDate = requestBody.classroomAssignment!.dueDate;
                        break;
                    default:
                        break;
                }
            }
        }

        const whereClause = contructWhereClause(requestBody);

        if (!whereClause.id) {
            return NextResponse.json({ error: "Invalid request" }, { status: 400 })
        }

        const classroomAssignment = await db.classroomAssignment.update({
            where: whereClause,
            data: data
        });

        if (!classroomAssignment) {
            return NextResponse.json({ error: "Assignment not found" }, { status: 404 })
        }

        return NextResponse.json({ classroomAssignment }, { status: 200 })

    } catch (error) {
        console.log("error", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}