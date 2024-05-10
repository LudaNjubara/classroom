import { db } from "@/config";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { Message } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const MESSAGES_BATCH_SIZE = 10;

const senderStrategy = {
    "TEACHER": async (teacherId: string) => {
        return await db.teacher.findUnique({
            where: {
                id: teacherId
            }
        });
    },
    "STUDENT": async (studentId: string) => {
        return await db.student.findUnique({
            where: {
                id: studentId
            }
        });
    }
}

export async function GET(req: NextRequest) {
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
            return NextResponse.json("Unauthorized", { status: 401 });
        }

        const { searchParams } = new URL(req.url);

        const cursor = searchParams.get("cursor");
        const channelId = searchParams.get("channelId");

        if (!channelId) {
            return NextResponse.json("Channel ID is required", { status: 400 });
        }

        let messages: Message[] = [];

        if (cursor) {
            messages = await db.message.findMany({
                take: MESSAGES_BATCH_SIZE,
                skip: 1,
                cursor: {
                    id: cursor
                },
                where: {
                    channelId
                },
                orderBy: {
                    createdAt: "desc"
                },
            });
        } else {
            messages = await db.message.findMany({
                take: MESSAGES_BATCH_SIZE,
                where: {
                    channelId
                },
                orderBy: {
                    createdAt: "desc"
                }
            })
        }

        // Fetch sender data for each message
        const messagesWithSenderData = await Promise.all(
            messages.map(async (message) => {
                const senderData = await senderStrategy[message.senderRole](message.senderId);
                return { ...message, senderData };
            })
        );

        let nextCursor = null;

        if (messages.length === MESSAGES_BATCH_SIZE) {
            nextCursor = messages[messages.length - 1].id;
        }

        return NextResponse.json({ messages: messagesWithSenderData, nextCursor });
    } catch (error) {
        console.log("Messages GET error", error)
        return NextResponse.json("Internal Server Error", { status: 500 });
    }
}