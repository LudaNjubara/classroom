import { db } from "@/config";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { Notification } from "@prisma/client";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
    try {
        const { isAuthenticated } = getKindeServerSession();

        if (!isAuthenticated()) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { notification: notificationData } = await req.json() as { notification: Notification };

        // get the organization from the notification
        const organization = await db.organization.findUnique({
            where: {
                id: notificationData.senderId
            }
        });

        // get the teacher from the notification
        const teacher = await db.teacher.findUnique({
            where: {
                id: notificationData.recipientId
            }
        });

        if (!organization || !teacher) {
            return NextResponse.json({ error: "Organization or teacher not found" }, { status: 404 })
        }

        // update the teacher with the organization
        // update the notification status to ACCEPTED
        const notification = await db.notification.update({
            where: {
                id: notificationData.id
            },
            data: {
                status: "REJECTED",
            }
        }
        );

        return NextResponse.json({ notification }, { status: 200 })
    }

    catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}