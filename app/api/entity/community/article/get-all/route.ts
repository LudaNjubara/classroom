import { db } from "@/config";
import { isInEnum } from "@/utils/misc";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { ArticleType, Role } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

type TAllowedRoles = Exclude<Role, "ADMIN" | "GUEST">;

export async function GET(req: NextRequest) {
    try {
        const { isAuthenticated, getUser } = getKindeServerSession();

        if (!await isAuthenticated()) {
            return NextResponse.json("Unauthorized", { status: 401 });
        }

        const user = await getUser();

        if (!user) {
            return NextResponse.json("Unauthorized", { status: 401 });
        }

        const profile = await db.profile.findUnique({
            where: {
                kindeId: user.id
            }
        });

        if (!profile) {
            return NextResponse.json({ error: "Profile not found" }, { status: 404 })
        }

        const allowedRoles: TAllowedRoles[] = ["STUDENT", "TEACHER", "ORGANIZATION"];

        if (!allowedRoles.includes(profile.role as TAllowedRoles)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { searchParams } = new URL(req.url)
        const organizationId = searchParams.get('organizationId')
        const articleType = searchParams.get('articleType')

        if (articleType) {
            if (!isInEnum(ArticleType, articleType)) {
                return NextResponse.json({ error: "Invalid article type" }, { status: 400 })
            }
        }

        const articles = await db.article.findMany({
            where: {
                organizationId: organizationId ? organizationId : undefined,
                isPublic: organizationId ? undefined : true,
                type: articleType ? articleType as ArticleType : {
                    in: [ArticleType.ARTICLE, ArticleType.NEWS]
                }
            },
        });

        return NextResponse.json({ data: articles }, { status: 200 })
    }

    catch (error) {
        console.log("error", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}