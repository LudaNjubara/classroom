import { db } from "@/config";
import { NotificationWithOrgSender } from "@/features/notifications/types";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const { getUser, isAuthenticated } = getKindeServerSession();

        if (!isAuthenticated()) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const user = await getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }
        const teacher = await db.teacher.findFirst({
            where: {
                profileId: user.id
            }
        });

        if (!teacher) {
            return NextResponse.json({ error: "Teacher not found" }, { status: 404 })
        }

        const [count, notifications] = await db.$transaction([
            db.notification.count({
                where: {
                    recipientId: teacher.id,
                    senderType: "ORGANIZATION"
                }
            }),
            db.notification.findMany({
                where: {
                    recipientId: teacher.id,
                    senderType: "ORGANIZATION"
                },
                orderBy: {
                    status: 'asc',
                },
            })
        ]);

        const data: NotificationWithOrgSender[] = await Promise.all(notifications.map(async n => {
            const org = await db.organization.findUnique({
                where: {
                    id: n.senderId
                }
            });

            return {
                ...n,
                sender: org!
            };
        }))

        return NextResponse.json({ count, data }, { status: 200 })

        return NextResponse.json({ count: notifications[0], data: notifications[1] }, { status: 200 })
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}