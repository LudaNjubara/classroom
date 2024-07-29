import { db } from "@/config/db";
import { ORGANIZATION_DEFAULT_INVITE_MESSAGE } from "@/constants";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { Role } from "@prisma/client";
import { NextResponse } from "next/server";

type TAllowedRoles = Exclude<Role, "ADMIN" | "GUEST">;

export async function POST(req: Request) {
    try {
        const { isAuthenticated, getUser } = getKindeServerSession();

        if (!await isAuthenticated()) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const user = await getUser();

        if (!user) {
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

        const data = await db.$transaction([
            db.organization
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
                }),
            db.profile.update({
                where: {
                    kindeId: profileId,
                },
                data: {
                    role: "ORGANIZATION",
                }
            }),
        ])

        if (!data || !data[0] || !data[1]) {
            return NextResponse.json({ error: "Organization creation failed" }, { status: 400 })
        }

        const organization = data[0];
        const profile = data[1];

        const organizationSettings = await db.organizationSettings.create({
            data: {
                organizationId: organization.id,
                key: "DEFAULT_INVITE_MESSAGE",
                value: ORGANIZATION_DEFAULT_INVITE_MESSAGE,
                type: "STRING",
            }
        });

        if (!organizationSettings) {
            // rollback the organization creation and profile update
            await db.organization.delete({
                where: {
                    id: organization.id,
                }
            });

            await db.profile.update({
                where: {
                    kindeId: profileId,
                },
                data: {
                    role: "GUEST",
                }
            });

            return NextResponse.json({ error: "Organization creation failed" }, { status: 400 })
        }

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
    ORGANIZATION: async (kindeId: string) => {
        const organization = await db.organization.findFirst({
            where: {
                profileId: kindeId,
            },
            include: {
                students: {
                    include: {
                        student: true,
                    }
                },
                teachers: {
                    include: {
                        teacher: true,
                    }
                },
                classrooms: true,
            }
        });

        if (organization?.teachers) {
            const teachers = organization?.teachers.map(organizationTeacher => organizationTeacher.teacher);

            // @ts-ignore
            organization.teachers = teachers;
        }

        if (organization?.students) {
            const students = organization?.students.map(organizationStudent => organizationStudent.student);

            // @ts-ignore
            organization.students = students;
        }

        return [organization];
    },
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
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const profile = await db.profile.findUnique({
            where: {
                kindeId: user.id,
            }
        });

        if (!profile) {
            return NextResponse.json({ error: "Profile not found" }, { status: 404 })
        }

        const allowedRoles: TAllowedRoles[] = ["STUDENT", "TEACHER", "ORGANIZATION"];

        if (!allowedRoles.includes(profile.role as TAllowedRoles)) {
            return NextResponse.json("Unauthorized", { status: 401 })
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