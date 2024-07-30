import { ArticleType } from "@prisma/client";

export type TCreateCommunityArticleRequestBody = {
    isPublic: boolean;
    organizationId?: string;
    title: string;
    description?: string;
    content: string;
    tags: string[];
    imageURL: string;
    type: ArticleType;
}

export type TCommunityArticlePreview = {
    title: string;
    description: string;
    content: string;
    tags: string;
    imageUrl?: string;
    imageFileName?: string;
}

export type TCreateCommunityArticleCommentRequestBody = {
    articleId: string;
    content: string;
}
