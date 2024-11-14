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
        const student = await db.student.findFirst({
            where: {
                profileId: user.id
            }
        });

        if (!student) {
            return NextResponse.json({ error: "Student not found" }, { status: 404 })
        }

        const [count, notifications] = await db.$transaction([
            db.notification.count({
                where: {
                    recipientId: student.id,
                    senderType: "ORGANIZATION"
                }
            }),
            db.notification.findMany({
                where: {
                    recipientId: student.id,
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
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}