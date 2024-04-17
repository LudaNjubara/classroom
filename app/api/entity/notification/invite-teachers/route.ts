import { db } from "@/config";
import { TSelectedTeacherItem } from "@/features/teachers";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { getUser, isAuthenticated } = getKindeServerSession();

        if (!isAuthenticated()) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const user = await getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { teacherItems }: { teacherItems: TSelectedTeacherItem[] } = await req.json();

        const organization = await db.organization.findFirst({
            where: {
                profileId: user.id
            }
        });

        if (!organization) {
            return NextResponse.json({ error: "Organization not found" }, { status: 404 })
        }

        await db.$transaction(
            teacherItems.map((item) => db.notification.create({
                data: {
                    type: "ORGANIZATION_INVITE_TEACHER",
                    message: item.inviteMessage ?? "Join our organization",
                    recipientId: item.teacherId,
                    recipientType: "TEACHER",
                    senderId: organization.id,
                    senderType: "ORGANIZATION",
                }

            }))
        );

        return NextResponse.json({ message: "Invitations sent successfully" }, { status: 200 })
    }

    catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}