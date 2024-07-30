import { db } from "@/config";
import { TCreateCommunityArticleRequestBody } from "@/features/community";
import { backendClient } from "@/lib/edgestore-server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { ArticleUserType, Role } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

type TAllowedRoles = Exclude<Role, "ADMIN" | "GUEST">;

const validateRequestBody = (body: Object & TCreateCommunityArticleRequestBody) => {
    if (!body.hasOwnProperty("title")
        || !body.hasOwnProperty("content")
        || !body.hasOwnProperty("tags")
        || !body.hasOwnProperty("imageURL")
        || !body.hasOwnProperty("type")
        || !body.hasOwnProperty("organizationId")
        || !body.hasOwnProperty("isPublic")) {
        return false;
    }

    return true;
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

        const { communityArticle }: {
            communityArticle: TCreateCommunityArticleRequestBody
        } = await req.json();

        if (!validateRequestBody(communityArticle)) {
            return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
        }

        // Confirm image url
        backendClient.publicFiles.confirmUpload({
            url: communityArticle.imageURL
        }).catch((error) => {
            console.log("error", error);
            return NextResponse.json({ error: "Invalid image URL" }, { status: 400 })
        });

        const article = await db.article.create({
            data: {
                title: communityArticle.title,
                description: communityArticle.description,
                content: communityArticle.content,
                tags: communityArticle.tags.join(","),
                imageURL: communityArticle.imageURL,
                type: communityArticle.type,
                isPublic: communityArticle.isPublic,
                organizationId: communityArticle.organizationId,
                authorId: profile.id,
                authorRole: mapRoleToArticleUserType(profile.role as TAllowedRoles),
            }
        });

        if (!article) {
            return NextResponse.json({ error: "Failed to create article" }, { status: 500 })
        }

        return NextResponse.json({ communityArticle: article }, { status: 201 });
    }

    catch (error) {
        console.log("error", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}