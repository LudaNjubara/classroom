import { db } from "@/config";
import { ERROR_MESSAGES } from "@/constants";
import { NextApiResponseServerIo } from "@/types/typings";
import { handleError } from "@/utils/handle-error";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { MessageSenderType } from "@prisma/client";
import { NextApiRequest } from "next";

const ALLOWED_ROLES: MessageSenderType[] = ["TEACHER", "STUDENT"];

const queryStrategies: {
    [key in MessageSenderType]: (profileId: string) => Promise<any>;
} = {
    TEACHER: async (profileId: string) => {
        const teacher = await db.teacher.findFirst({
            where: {
                profileId
            }
        });

        if (!teacher) {
            handleError(ERROR_MESSAGES.CLIENT_ERROR.NOT_FOUND.CODE)
        }

        return teacher;
    },
    STUDENT: async (profileId: string) => {
        const student = await db.student.findFirst({
            where: {
                profileId
            }
        });

        if (!student) {
            handleError(ERROR_MESSAGES.CLIENT_ERROR.NOT_FOUND.CODE)
        }

        return student;
    },
}

const constructWhereClause = (role: MessageSenderType, tenantId: string, classroomId: string) => {
    let whereClause = {}

    switch (role) {
        case "TEACHER":
            whereClause = {
                id: classroomId,
                teachers: {
                    some: {
                        teacherId: tenantId
                    }
                }
            }
            break;
        case "STUDENT":
            whereClause = {
                id: classroomId,
                students: {
                    some: {
                        studentId: tenantId
                    }
                },
            }
            break;
    }

    return whereClause;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponseServerIo
) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    try {
        const { isAuthenticated, getUser } = getKindeServerSession(req);

        if (!await isAuthenticated()) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const user = await getUser();

        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const profile = await db.profile.findUnique({
            where: {
                kindeId: user.id,
            },
        });

        if (!profile) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        if (!ALLOWED_ROLES.includes(profile.role as MessageSenderType)) {
            return res.status(403).json({ message: "Forbidden" });
        }

        const { content, fileUrl }: { content: string, fileUrl?: string } = req.body;
        const { classroomId, channelId } = req.query;

        if (!classroomId || !channelId) {
            return res.status(400).json({ message: "Classroom ID or Channel ID is missing" });
        }

        if (!content) {
            return res.status(400).json({ message: "Message content is missing" });
        }

        const tenant = await queryStrategies[profile!.role as MessageSenderType](profile!.kindeId);

        if (!tenant) {
            return res.status(404).json({ message: "Tenant not found" });
        }

        const whereClause = constructWhereClause(
            profile.role as MessageSenderType,
            tenant.id,
            classroomId as string
        );

        const classroom = await db.classroom.findFirst({
            where: whereClause,
        });

        if (!classroom) {
            return res.status(404).json({ message: "Classroom not found" });
        }

        const channel = await db.classroomChannel.findFirst({
            where: {
                id: channelId as string,
                classroomId: classroomId as string,
            },
        });

        if (!channel) {
            return res.status(404).json({ message: "Channel not found" });
        }

        const message = await db.message.create({
            data: {
                content,
                fileUrl,
                senderId: tenant.id,
                senderRole: profile.role as MessageSenderType,
                channelId: channelId as string,
            },
        });

        const channelKey = `chat:${channel.id}:add-message`;

        const messageToSend = {
            ...message,
            senderData: tenant,
        }

        res?.socket?.server?.io?.emit(channelKey, messageToSend);

        return res.status(200).json({
            data: {
                message,
                sender: tenant,
            }
        });

    } catch (error) {
        console.log("MESSAGES_POST", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}