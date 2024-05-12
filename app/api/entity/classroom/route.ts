import { db } from "@/config";
import { TChannelRequest, TClassroomSettings, TFileUploadResponseWithFilename, TScheduleItem } from "@/features/classrooms/types";
import { TSelectedStudentItem } from "@/features/students";
import { TSelectedTeacherItem } from "@/features/teachers";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { ClassroomSetting, ClassroomSettings } from "@prisma/client";
import { NextResponse } from "next/server";

type TWhereClauseParams = {
    resources?: TFileUploadResponseWithFilename[];
    channel?: TChannelRequest;
};

type TWhereClause = {
    id: string;
};

const contructWhereClause = ({ channel, resources }: TWhereClauseParams): TWhereClause => {
    let whereClause = { id: "" };

    if (channel) {
        whereClause = {
            ...whereClause,
            id: channel.metadata.classroomId
        }
    }

    if (resources) {
        whereClause = {
            ...whereClause,
            id: resources[0].metadata.classroomId!
        }
    }

    return whereClause;
}

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

        const requestBody: {
            resources?: TFileUploadResponseWithFilename[];
            channel?: TChannelRequest;
        } = await req.json();

        // Prepare data for update
        const data: any = {};

        for (const key in requestBody) {
            if (requestBody.hasOwnProperty(key)) {
                switch (key) {
                    case 'resources':
                        data.resources = {
                            create: requestBody.resources!.map((resource: TFileUploadResponseWithFilename) => ({
                                url: resource.url,
                                name: resource.filename,
                                size: resource.size,
                                metadata: {
                                    create: {
                                        profileId: resource.metadata.profileId,
                                        userId: resource.metadata.userId,
                                        userRole: resource.metadata.userRole,
                                        classroomId: resource.metadata.classroomId,
                                        channelId: resource.metadata.channelId,
                                    }
                                }
                            }))
                        };
                        break;
                    case 'channel':
                        data.channels = {
                            create: {
                                name: requestBody.channel!.name,
                            },
                        };
                        break;
                    // Add more cases here for other request keys
                    default:
                        break;
                }
            }
        }

        const whereClause = contructWhereClause(requestBody);

        if (!whereClause.id) {
            return NextResponse.json({ error: "Invalid request" }, { status: 400 })
        }

        console.log("data", data)
        // Update classroom
        const classroom = await db.classroom.update({
            where: whereClause,
            data
        });

        return NextResponse.json({ classroom }, { status: 200 })
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}