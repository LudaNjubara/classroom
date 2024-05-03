import { db } from "@/config";
import { TClassroomSettings, TFileUploadResponseWithFilename, TScheduleItem } from "@/features/classrooms/types";
import { TSelectedStudentItem } from "@/features/students";
import { TSelectedTeacherItem } from "@/features/teachers";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { ClassroomSetting, ClassroomSettings } from "@prisma/client";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { isAuthenticated } = getKindeServerSession();

        if (!isAuthenticated()) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { studentItems, teacherItems, classroomSettings, scheduleItems, organizationId, classroom: classroomData }: {
            studentItems: TSelectedStudentItem[];
            teacherItems: TSelectedTeacherItem[];
            classroomSettings: TClassroomSettings;
            scheduleItems: TScheduleItem[];
            organizationId: string;
            classroom: {
                name: string;
                description: string;
            };
        } = await req.json();

        let classroomSettingsCreateClause: Omit<ClassroomSettings, "classroomId" | "id">[] = []

        if (classroomSettings) {
            classroomSettingsCreateClause = Object.entries(classroomSettings).map(([key, value]) => ({
                key: key as ClassroomSetting,
                value: value.value,
                type: value.metadata.type
            }))
        }

        // Create classroom
        const classroom = await db.classroom.create({
            data: {
                name: classroomData.name,
                description: classroomData.description,
                organization: {
                    connect: {
                        id: organizationId
                    }
                },
                students: {
                    create: studentItems.map((studentItem) => ({
                        student: {
                            connect: {
                                id: studentItem.studentId,
                            }
                        }
                    }))
                },
                teachers: {
                    create: teacherItems.map((teacherItem) => ({
                        teacher: {
                            connect: {
                                id: teacherItem.teacherId,
                            }
                        }
                    }))
                },
                settings: {
                    create: classroomSettingsCreateClause
                },
                schedule: {
                    create: scheduleItems.map((scheduleItem) => ({
                        dayOfWeek: scheduleItem.day,
                        startTime: scheduleItem.startTime,
                        startTimeAmPm: scheduleItem.startTimeAmPm,
                        endTime: scheduleItem.endTime,
                        endTimeAmPm: scheduleItem.endTimeAmPm,
                    }))
                },
                resources: {
                    create: []
                }
            }
        });

        return NextResponse.json({ classroom }, { status: 201 })
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }

}

export async function PUT(req: Request) {
    try {
        const { isAuthenticated } = getKindeServerSession();

        if (!isAuthenticated()) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { resources }: {
            resources?: TFileUploadResponseWithFilename[];
        } = await req.json();

        if (!resources) {
            return NextResponse.json({ error: "Invalid request" }, { status: 400 })
        }

        // Update classroom
        const classroom = await db.classroom.update({
            where: {
                id: resources[0].metadata.classroomId
            },
            data: {
                resources: {
                    create: resources.map((resource) => ({
                        url: resource.url,
                        name: resource.filename,
                        size: resource.size,
                        metadata: {
                            create: {
                                profileId: resource.metadata.profileId,
                                userId: resource.metadata.userId,
                                userRole: resource.metadata.userRole,
                                classroomId: resource.metadata.classroomId,
                            }
                        }
                    }))
                }
            }
        });

        return NextResponse.json({ classroom }, { status: 200 })
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}