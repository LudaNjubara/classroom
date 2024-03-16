import { db } from "@/config/db";
import { TOrderBy, TTeacherSearchBy } from "@/types/typings";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextRequest, NextResponse } from "next/server";

type TWhereClauseParams = {
    organizationId: string | null;
    query: string | null;
    searchByArray: typeof ALLOWED_SEARCH_BY_ARRAY | null;
};

type TOrderByClauseParams = {
    orderBy: TOrderBy | null;
    searchByArray: typeof ALLOWED_SEARCH_BY_ARRAY | null;
};

type TWhereClause = {
    [key: string]: any;
};

type TOrderByClause = {
    [key: string]: TOrderBy | undefined;
};

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

function constructWhereClause({ organizationId, query, searchByArray }: TWhereClauseParams): TWhereClause {
    let whereClause: TWhereClause = {};

    if (organizationId) {
        whereClause = { ...whereClause, organizationId };
    }

    if (query && searchByArray) {
        whereClause = {
            ...whereClause,
            OR: searchByArray.map((searchBy) => ({
                [searchBy]: {
                    contains: query,
                },
            })),
        };
    } else if (query) {
        whereClause = {
            ...whereClause,
            OR: ALLOWED_SEARCH_BY_ARRAY.map((searchBy) => ({
                [searchBy]: {
                    contains: query,
                },
            })),
        };
    }

    return whereClause;
}

function constructOrderByClause({ orderBy, searchByArray }: TOrderByClauseParams): TOrderByClause {
    let orderByClause: TOrderByClause = {};

    if (orderBy && searchByArray) {
        searchByArray.forEach((searchBy) => {
            orderByClause = { ...orderByClause, [searchBy]: orderBy };
        });
    } else if (orderBy) {
        orderByClause = { name: orderBy };
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

        if (!await isAuthenticated()) {
            return NextResponse.json("Unauthorized", { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const organizationId = searchParams.get("organizationId");
        const from = searchParams.get("from");
        const query = searchParams.get("query");
        const searchBy = searchParams.get("searchBy")
        const orderBy = searchParams.get("orderBy") as TOrderBy;

        if (from && isNaN(parseInt(from))) {
            return NextResponse.json({ error: "Invalid query parameter 'from'" }, { status: 400 })
        } else if (searchBy && searchBy.split(",").every((searchBy) => ALLOWED_SEARCH_BY_ARRAY.includes(searchBy)) && !query) {
            return NextResponse.json({ error: "Invalid query parameter 'query'. Used without 'searchBy' parameter" }, { status: 400 })
        } else if (query && searchBy && !searchBy.split(",").every((searchBy) => ALLOWED_SEARCH_BY_ARRAY.includes(searchBy))) {
            return NextResponse.json({ error: "Invalid query parameter 'searchBy'" }, { status: 400 })
        } else if (orderBy && !ALLOWED_ORDER_BY_ARRAY.includes(orderBy)) {
            return NextResponse.json({ error: "Invalid query parameter 'orderBy'" }, { status: 400 })
        }

        const searchByArray = searchBy ? searchBy.split(",") : null;

        const whereClause = constructWhereClause({ organizationId, query, searchByArray });
        const orderByClause = constructOrderByClause({ orderBy, searchByArray });

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
        console.log("error", error);
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