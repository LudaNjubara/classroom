import { db } from "@/config";
import { ERROR_MESSAGES } from "@/constants";
import { NextApiResponseServerIo } from "@/types/typings";
import { handleError } from "@/utils/handle-error";
import { sanitizeInput } from "@/utils/misc";
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

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponseServerIo
) {
    if (req.method !== "PATCH" && req.method !== "DELETE") {
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

        /* Updating message content */
        if (req.method === "PATCH") {
            const { content }: { content: string } = JSON.parse(req.body);
            const { messageId, channelId } = req.query;

            if (!content) {
                return res.status(400).json({ message: "Message content is missing" });
            }

            if (!messageId) {
                return res.status(400).json({ message: "Message ID is missing" });
            }

            if (!channelId) {
                return res.status(400).json({ message: "Channel ID is missing" });
            }

            const tenant = await queryStrategies[profile!.role as MessageSenderType](profile!.kindeId);

            if (!tenant) {
                return res.status(404).json({ message: "Tenant not found" });
            }

            const message = await db.message.update({
                where: {
                    id: messageId as string,
                },
                data: {
                    content: sanitizeInput(content),
                },
            });

            const channelKey = `chat:${channelId}:update-message`;

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
        }

        /* Soft deleting message */
        if (req.method === "DELETE") {
            const { messageId, channelId } = req.query;

            if (!messageId) {
                return res.status(400).json({ message: "Message ID is missing" });
            }

            const message = await db.message.findUnique({
                where: {
                    id: messageId as string,
                },
            });

            if (!message) {
                return res.status(404).json({ message: "Message not found" });
            }

            const tenant = await queryStrategies[profile!.role as MessageSenderType](profile!.kindeId);

            if (!tenant) {
                return res.status(404).json({ message: "Tenant not found" });
            }

            const deletedMessage = await db.message.update({
                where: {
                    id: messageId as string,
                },
                data: {
                    content: "This mesaage has been deleted",
                    deleted: true,
                }
            });

            const channelKey = `chat:${channelId}:update-message`;

            const messageToSend = {
                ...deletedMessage,
                senderData: tenant,
            }

            res?.socket?.server?.io?.emit(channelKey, messageToSend);

            return res.status(200).json({
                data: {
                    message: messageToSend,
                    sender: tenant,
                }
            });
        }

    } catch (error) {
        console.log("MESSAGES_POST", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}