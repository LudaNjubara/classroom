import { db } from "@/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { Teacher } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const TAKE_LIMIT = 10;
const TEMPLATE_TEACHER: Teacher = {
    id: "",
    name: "",
    email: "",
    address: "",
    city: "",
    state: "",
    country: "",
    phone: "",
    profileId: "",
    organizationId: "",
    createdAt: new Date(),
    updatedAt: new Date(),
}
const ALLOWED_ORDER_BY_ARRAY = Object.keys(TEMPLATE_TEACHER);
const ALLOWED_ORDER_ARRAY = ["asc", "desc"];

const constructWhereClause = (options: Partial<Teacher>) => {
    const { organizationId, ...rest } = options;
    let whereClause = {};

    if (organizationId) {
        whereClause = {
            ...rest,
            organizationId,
            profile: {
                role: "TEACHER"
            },
        };
    } else {
        whereClause = {
            ...rest,
            organizationId: null,
            profile: {
                role: "TEACHER"
            },
        };
    }

    return whereClause;
}

const constructOrderByClause = (options: { orderBy: string | null, order: string | null }) => {
    const { orderBy, order } = options;
    let orderByClause;

    if (orderBy && order) {
        orderByClause = {
            [orderBy]: order,
        };
    } else if (orderBy) {
        orderByClause = {
            [orderBy]: "asc",
        };
    } else {
        orderByClause = undefined;
    }

    return orderByClause;
}

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


        const teacher = await db.teacher
            .create({
                data: {
                    name,
                    email,
                    address,
                    city,
                    state,
                    country,
                    phone,
                    profileId,
                    organizationId: null,
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
                role: "TEACHER",
            }
        })

        return NextResponse.json({ teacher, profile }, { status: 201 })
    }

    catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}

export async function GET(request: NextRequest) {
    try {
        const { isAuthenticated } = getKindeServerSession();

        if (!isAuthenticated()) {
            return NextResponse.json("Unauthorized", { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const organizationId = searchParams.get("organizationId");
        const from = searchParams.get("from");
        const orderBy = searchParams.get("orderBy");
        const order = searchParams.get("order");

        if (from && isNaN(parseInt(from))) {
            throw new Error("Invalid query parameter 'from'");
        } else if (orderBy && !ALLOWED_ORDER_BY_ARRAY.includes(orderBy)) {
            throw new Error("Invalid query parameter 'orderBy'");
        } else if (order && !ALLOWED_ORDER_ARRAY.includes(order)) {
            throw new Error("Invalid query parameter 'order'");
        }

        const whereClause = constructWhereClause({ organizationId });
        const orderByClause = constructOrderByClause({ orderBy, order });

        const teachers = await db.teacher.findMany({
            where: whereClause,
            include: {
                profile: true,
            },
            skip: from ? parseInt(from) : 0,
            take: TAKE_LIMIT,
            orderBy: orderByClause,
        })

        return NextResponse.json({ teachers }, { status: 200 })
    }

    catch (error) {
        console.log(error);
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 400 })
        }

        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}

/* export async function GET() {
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
} */