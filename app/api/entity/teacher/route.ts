import { db } from "@/config/db";
import { TTeacherSearchBy } from "@/types/typings";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { Teacher } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const TAKE_LIMIT = 10;
const TEMPLATE_TEACHER_FOR_SEARCH_BY: TTeacherSearchBy = {
    name: "",
    email: "",
    address: "",
    city: "",
    state: "",
    country: "",
    phone: "",
}
const ALLOWED_SEARCH_BY_ARRAY = Object.keys(TEMPLATE_TEACHER_FOR_SEARCH_BY);
const ALLOWED_ORDER_BY_ARRAY = ["asc", "desc"];

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

const constructOrderByClause = (options: { searchBy: string | null, orderBy: string | null }) => {
    const { searchBy, orderBy } = options;
    let orderByClause;

    if (searchBy && orderBy) {
        orderByClause = {
            [searchBy]: orderBy,
        };
    } else if (searchBy) {
        orderByClause = {
            [searchBy]: "asc",
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
        const query = searchParams.get("query");
        const searchBy = searchParams.get("searchBy")
        const orderBy = searchParams.get("orderBy");

        console.log("url", request.url);

        if (from && isNaN(parseInt(from))) {
            throw new Error("Invalid query parameter 'from'");
        } else if (searchBy && searchBy.split(",").every((searchBy) => ALLOWED_SEARCH_BY_ARRAY.includes(searchBy)) && !query) {
            throw new Error("Invalid query parameter 'searchBy'. Used without 'query' parameter");
        } else if (query && searchBy && !searchBy.split(",").every((searchBy) => ALLOWED_SEARCH_BY_ARRAY.includes(searchBy))) {
            throw new Error("Invalid query parameter 'searchBy'");
        } else if (orderBy && !ALLOWED_ORDER_BY_ARRAY.includes(orderBy)) {
            throw new Error("Invalid query parameter 'orderBy'");
        }

        console.log({ organizationId, from, searchBy, orderBy })

        const whereClause = constructWhereClause({ organizationId });
        const orderByClause = constructOrderByClause({ searchBy: null, orderBy });

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