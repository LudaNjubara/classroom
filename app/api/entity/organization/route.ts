import { db } from "@/config/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { Role } from "@prisma/client";
import { NextResponse } from "next/server";

type TAllowedRoles = Exclude<Role, "ADMIN" | "ORGANIZATION" | "GUEST">;

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

const roleStrategies: {
    [key in TAllowedRoles]: (kindeId: string) => Promise<any>;
} = {
    STUDENT: async (kindeId: string) => {
        const studentOrganizations = await db.organization.findMany({
            where: {
                students: {
                    some: {
                        student: {
                            profileId: kindeId,
                        }
                    }
                }
            },
        });
        return studentOrganizations;
    },
    TEACHER: async (kindeId: string) => {
        const teacherOrganizations = await db.organization.findMany({
            where: {
                teachers: {
                    some: {
                        teacher: {
                            profileId: kindeId,
                        }
                    }
                }
            },
        });
        return teacherOrganizations;
    },
};

export async function GET() {
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

        const allowedRoles: TAllowedRoles[] = ["STUDENT", "TEACHER"];

        if (!allowedRoles.includes(profile.role as TAllowedRoles)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        // fetch all organizations associated with the profile
        const organizations = await roleStrategies[profile.role as TAllowedRoles](user.id);

        return NextResponse.json({ organizations }, { status: 200 })
    }

    catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}