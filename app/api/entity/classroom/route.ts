import { db } from "@/config";
import { TChannelRequest, TClassroomSettings, TFileUploadResponseWithFilename, TScheduleItem, TUpdateClassroomRequestBody, TUpdateClassroomSettingsRequestBody, TUpdateClassroomStudentsRequestBody, TUpdateClassroomTeachersRequestBody } from "@/features/classrooms/types";
import { TSelectedStudentItem } from "@/features/students";
import { TSelectedTeacherItem } from "@/features/teachers";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { ClassroomSetting, ClassroomSettings } from "@prisma/client";
import { NextResponse } from "next/server";

type TWhereClauseParams = {
    resources?: TFileUploadResponseWithFilename[];
    channel?: TChannelRequest;
    classroom?: TUpdateClassroomRequestBody;
    classroomSettings?: TUpdateClassroomSettingsRequestBody;
    classroomTeachers?: TUpdateClassroomTeachersRequestBody;
    classroomStudents?: TUpdateClassroomStudentsRequestBody;
};

type TWhereClause = {
    id: string;
};

const contructWhereClause = ({ channel, resources, classroom, classroomSettings, classroomTeachers, classroomStudents }: TWhereClauseParams): TWhereClause => {
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

    if (classroom) {
        whereClause = {
            ...whereClause,
            id: classroom.id
        }
    }

    if (classroomSettings) {
        whereClause = {
            ...whereClause,
            id: classroomSettings.classroomId
        }
    }

    if (classroomTeachers) {
        whereClause = {
            ...whereClause,
            id: classroomTeachers.classroomId
        }
    }

    if (classroomStudents) {
        whereClause = {
            ...whereClause,
            id: classroomStudents.classroomId
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
            classroom?: TUpdateClassroomRequestBody;
            classroomSettings?: TUpdateClassroomSettingsRequestBody;
            classroomTeachers?: TUpdateClassroomTeachersRequestBody;
            classroomStudents?: TUpdateClassroomStudentsRequestBody;
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
                    case 'classroom':
                        data.name = requestBody.classroom!.name;
                        data.description = requestBody.classroom!.description;
                        break;
                    case 'classroomSettings':
                        data.settings = Object.entries(requestBody.classroomSettings!.settings).map(([key, value]) => ({
                            id: value.id,
                            key: key as ClassroomSetting,
                            value: value.value,
                            type: value.metadata.type
                        }))
                        break;
                    case 'classroomTeachers':
                        data.teachers = requestBody.classroomTeachers!.teachers.map((teacherId) => ({
                            classroomId: requestBody.classroomTeachers!.classroomId,
                            teacherId: teacherId
                        }))
                        break;
                    case 'classroomStudents':
                        data.students = requestBody.classroomStudents!.students.map((studentId) => ({
                            classroomId: requestBody.classroomStudents!.classroomId,
                            studentId: studentId
                        }))
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

        // Update classroom
        if (data.settings) {
            // @ts-ignore-next-line
            const a = data.settings.forEach(async (setting) => {
                await db.classroomSettings.update({
                    where: {
                        id: setting.id
                    },
                    data: setting
                })
            });
        } else if (data.teachers) {
            const classroom = await db.classroomTeacher.createMany({
                data: data.teachers
            });
        } else if (data.students) {
            const classroom = await db.classroomStudent.createMany({
                data: data.students
            });
        } else {
            const classroom = await db.classroom.update({
                where: whereClause,
                data: data
            });
        }


        return NextResponse.json({ message: "Classroom updated successfully" }, { status: 200 })
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}