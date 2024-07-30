"use server"

import { API_ENDPOINTS } from "@/constants";
import { ArticleUserType } from "@prisma/client";
import { cookies } from "next/headers";

type TFetchCommunityArticleAuthorProps = {
    authorId: string;
    authorRole: ArticleUserType;
};

export async function fetchCommunityArticleAuthor({ authorId, authorRole }: TFetchCommunityArticleAuthorProps) {
    const urlSearchParams = new URLSearchParams({
        authorId,
        authorRole
    });

    const response = await fetch(`${API_ENDPOINTS.COMMUNITY.ARTICLE.GET_AUTHOR}?${urlSearchParams}`, {
        headers: {
            "Content-Type": "application/json",
            Cookie: cookies().toString()
        },
    });

    if (!response.ok) {
        const res = await response.json();

        throw new Error(res.error)
    }

    return response.json() as unknown as { data: any }
};