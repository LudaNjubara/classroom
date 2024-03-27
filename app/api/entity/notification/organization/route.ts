import { db } from "@/config";
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

        console.log("userId", user.id)

        const notifications = await db.$transaction([
            db.notification.count({
                where: {
                    recipientId: user.id,
                    senderType: "ORGANIZATION"
                }
            }),
            db.notification.findMany({
                where: {
                    recipientId: user.id,
                    senderType: "ORGANIZATION"
                },
                orderBy: {
                    status: 'asc'
                },
            })
        ]);

        console.log(notifications)

        return NextResponse.json({ count: notifications[0], data: notifications[1] }, { status: 200 })
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}