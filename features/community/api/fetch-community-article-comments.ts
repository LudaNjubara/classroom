"use server"

import { API_ENDPOINTS } from "@/constants";
import { ArticleComment } from "@prisma/client";
import { cookies } from "next/headers";

type TFetchCommunityArticleCommentsProps = {
    articleId: string;
};

export async function fetchCommunityArticleComments({ articleId }: TFetchCommunityArticleCommentsProps) {
    const urlSearchParams = new URLSearchParams({ articleId });

    const response = await fetch(`${API_ENDPOINTS.COMMUNITY.ARTICLE.COMMENT.GET_ALL}?${urlSearchParams}`, {
        headers: {
            "Content-Type": "application/json",
            Cookie: cookies().toString()
        },
    });

    if (!response.ok) {
        const res = await response.json();

        throw new Error(res.error)
    }

    return response.json() as unknown as { data: ArticleComment[] };
};