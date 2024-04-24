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

        const { notification } = await req.json() as { notification: Notification };

        // get the organization from the notification
        const organization = await db.organization.findUnique({
            where: {
                id: notification.senderId
            }
        });

        // get the student from the notification
        const student = await db.student.findUnique({
            where: {
                id: notification.recipientId
            }
        });

        if (!organization || !student) {
            return NextResponse.json({ error: "Organization or student not found" }, { status: 404 })
        }

        const transaction = await db.$transaction([
            db.organizationStudent.create({
                data: {
                    organization: {
                        connect: {
                            id: organization.id
                        }
                    },
                    student: {
                        connect: {
                            id: student.id
                        }
                    }
                }
            }),
            db.notification.update({
                where: {
                    id: notification.id
                },
                data: {
                    status: "ACCEPTED",
                }
            })
        ]);

        return NextResponse.json({
            student: transaction[0],
            notification: transaction[1]
        }, { status: 200 })
    }

    catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}