import { db } from "@/config/db";
import { TUpdateOrganizationSettingsRequestBody } from "@/features/settings/types";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { OrganizationSetting, OrganizationSettings, Role } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

type TAllowedRoles = Exclude<Role, "ADMIN" | "GUEST" | "STUDENT" | "TEACHER">;

export async function GET(req: NextRequest) {
    try {
        const { getUser, isAuthenticated } = getKindeServerSession();

        if (!await isAuthenticated()) {
            return NextResponse.json("Unauthorized", { status: 401 });
        }

        const user = await getUser();

        if (!user) {
            return NextResponse.json("Unauthorized", { status: 401 });
        }

        const profile = await db.profile.findUnique({
            where: {
                kindeId: user.id,
            }
        });

        if (!profile) {
            return NextResponse.json({ error: "Profile not found" }, { status: 404 })
        }

        const allowedRoles: TAllowedRoles[] = ["ORGANIZATION"];

        if (!allowedRoles.includes(profile.role as TAllowedRoles)) {
            return NextResponse.json("Unauthorized", { status: 401 })
        }

        const { searchParams } = new URL(req.url)
        const organizationId = searchParams.get('organizationId')

        if (!organizationId) {
            return NextResponse.json({ error: "Invalid query parameter 'organizationId'" }, { status: 400 })
        }

        console.log("org ID: ", organizationId);
        const settings = await db.organizationSettings.findMany({
            where: {
                organizationId
            }
        });

        if (!settings) {
            throw new Error("Settings not found")
        }

        console.log(settings);

        return NextResponse.json({ data: settings }, { status: 200 })
    }

    catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}

export async function PUT(req: NextRequest) {
    try {
        const { getUser, isAuthenticated } = getKindeServerSession();

        if (!await isAuthenticated()) {
            return NextResponse.json("Unauthorized", { status: 401 });
        }

        const user = await getUser();

        if (!user) {
            return NextResponse.json("Unauthorized", { status: 401 });
        }

        const profile = await db.profile.findUnique({
            where: {
                kindeId: user.id,
            }
        });

        if (!profile) {
            return NextResponse.json({ error: "Profile not found" }, { status: 404 })
        }

        const allowedRoles: TAllowedRoles[] = ["ORGANIZATION"];

        if (!allowedRoles.includes(profile.role as TAllowedRoles)) {
            return NextResponse.json("Unauthorized", { status: 401 })
        }

        const requestBody: {
            organizationSettings: TUpdateOrganizationSettingsRequestBody
        } = await req.json();

        if (!requestBody.organizationSettings) {
            return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
        }

        const data: Omit<OrganizationSettings, "organizationId">[] = Object.entries(requestBody.organizationSettings.settings).map(([key, value]) => ({
            id: value.id,
            key: key as OrganizationSetting,
            value: value.value,
            type: value.metadata.type
        }));

        if (!data) {
            return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
        }

        const settings = data.map(async (setting) => {
            return await db.organizationSettings.update({
                where: {
                    id: setting.id
                },
                data: setting
            })
        });

        await Promise.all(settings);

        return NextResponse.json({ data: settings }, { status: 200 })
    }

    catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}