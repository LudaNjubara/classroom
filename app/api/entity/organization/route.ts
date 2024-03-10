import { db } from "@/config/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { isAuthenticated } = getKindeServerSession();

        if (!isAuthenticated()) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const {
            name,
            email,
            address,
            city,
            state,
            country,
            profileId,
            phone,
        } = await req.json();


        const organization = await db.organization
            .create({
                data: {
                    name,
                    email,
                    address,
                    city,
                    state,
                    country,
                    profileId,
                    phone,
                    students: {
                        create: [],
                    },
                    teachers: {
                        create: [],
                    },
                    classrooms: {
                        create: [],
                    },
                },
            })

        const profile = await db.profile.update({
            where: {
                kindeId: profileId,
            },
            data: {
                role: "ORGANIZATION",
            }
        })

        return NextResponse.json({ organization, profile }, { status: 201 })
    }

    catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}

export async function GET() {
    try {
        const { getUser, isAuthenticated } = getKindeServerSession();

        if (!isAuthenticated()) {
            return NextResponse.json("Unauthorized", { status: 401 });
        }

        const user = getUser();
        const organizations = await db.organization.findMany({
            where: {
                profileId: user.id!,
            },
            include: {
                students: true,
                teachers: true,
                classrooms: true,
            }
        })

        return NextResponse.json({ organizations }, { status: 200 })
    }

    catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}