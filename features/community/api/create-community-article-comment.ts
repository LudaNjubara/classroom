"use server";

import { API_ENDPOINTS } from "@/constants";
import { Article } from "@prisma/client";
import { cookies } from "next/headers";
import { TCreateCommunityArticleCommentRequestBody } from "../types";

export async function createCommunityArticleComment(
    communityArticleComment
        : TCreateCommunityArticleCommentRequestBody) {
    const response = await fetch(API_ENDPOINTS.COMMUNITY.ARTICLE.COMMENT.CREATE, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Cookie: cookies().toString(),
        },
        body: JSON.stringify({ communityArticleComment }),
    });

    if (!response.ok) {
        const res = await response.json();

        throw new Error(res.error)
    }

    return response.json() as unknown as { communityArticle: Article }
};