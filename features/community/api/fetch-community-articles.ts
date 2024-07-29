"use server"

import { API_ENDPOINTS } from "@/constants";
import { Article } from "@prisma/client";
import { cookies } from "next/headers";

type TFetchCommunityArticlesProps = {
    organizationId?: string;
    articleType?: string;
};

export async function fetchCommunityArticles({ organizationId, articleType }: TFetchCommunityArticlesProps) {
    const urlSearchParams = new URLSearchParams({
        organizationId: organizationId || "",
        articleType: articleType || "",
    });

    const response = await fetch(`${API_ENDPOINTS.COMMUNITY.ARTICLE.GET_ALL}?${urlSearchParams}`, {
        headers: {
            "Content-Type": "application/json",
            Cookie: cookies().toString()
        },
    });

    if (!response.ok) {
        const res = await response.json();

        throw new Error(res.error)
    }

    return response.json() as unknown as { data: Article[] }
};