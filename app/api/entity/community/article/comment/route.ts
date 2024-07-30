import { db } from "@/config";
import { TCreateCommunityArticleCommentRequestBody } from "@/features/community";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { ArticleUserType, Role } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const queryStrategies: {
    [key in TAllowedRoles]: (profileId: string) => Promise<any>;
} = {
    TEACHER: async (profileId: string) => {
        const teacher = await db.teacher.findFirst({
            where: {
                profileId
            }
        });

        if (!teacher) return null

        return teacher;
    },
    STUDENT: async (profileId: string) => {
        const student = await db.student.findFirst({
            where: {
                profileId
            }
        });

        if (!student) return null

        return student;
    },
    ORGANIZATION: async (profileId: string) => {
        const organization = await db.organization.findFirst({
            where: {
                profileId
            }
        });

        if (!organization) return null

        return organization;
    }
}

const mapRoleToArticleUserType = (role: TAllowedRoles): ArticleUserType => {
    let roleType: ArticleUserType;

    switch (role) {
        case "TEACHER":
            roleType = ArticleUserType.TEACHER
            break;
        case "ORGANIZATION":
            roleType = ArticleUserType.ORGANIZATION
            break;
        case "STUDENT":
            roleType = ArticleUserType.STUDENT
            break;
    }

    return roleType;
}

const validateRequestBody = (body: TCreateCommunityArticleCommentRequestBody) => {
    // implement
    return true
}

type TAllowedRoles = Exclude<Role, "ADMIN" | "GUEST">;

export async function POST(req: NextRequest) {
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

        const allowedRoles: TAllowedRoles[] = ["TEACHER", "ORGANIZATION", "STUDENT"];

        if (!allowedRoles.includes(profile.role as TAllowedRoles)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { communityArticleComment }: {
            communityArticleComment: TCreateCommunityArticleCommentRequestBody
        } = await req.json();

        if (!validateRequestBody(communityArticleComment)) {
            return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
        }

        const tenant = await queryStrategies[profile.role as TAllowedRoles](profile.kindeId);

        if (!tenant) {
            return NextResponse.json({ error: "Tenant not found" }, { status: 404 })
        }

        const articleComment = await db.articleComment.create({
            data: {
                authorId: tenant.id,
                articleId: communityArticleComment.articleId,
                content: communityArticleComment.content,
                authorRole: mapRoleToArticleUserType(profile.role as TAllowedRoles),
                authorPicture: profile.picture!,
                authorName: tenant.name,
            }
        });

        if (!articleComment) {
            return NextResponse.json({ error: "Failed to create a comment for the specified article" }, { status: 500 })
        }

        return NextResponse.json({ communityArticle: articleComment }, { status: 201 });
    }

    catch (error) {
        console.log("error", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}