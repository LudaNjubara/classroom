import { ArticleComment } from "@prisma/client";
import { useEffect, useRef, useState } from "react";
import { fetchCommunityArticleComments } from "../api";

type TUseCommunityArticleCommentsProps = {
    articleId: string;
};

export function useCommunityArticleComments({ articleId }: TUseCommunityArticleCommentsProps) {
    const [comments, setComments] = useState<ArticleComment[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [refetchIndex, setRefetchIndex] = useState(0);

    const shouldInitializeLoadingRef = useRef(true);

    useEffect(() => {
        const getCommunityArticleComments = async () => {
            setIsLoading(shouldInitializeLoadingRef.current);

            const requestData = { articleId };

            try {
                const { data } = await fetchCommunityArticleComments(requestData);

                setComments(data);
            } catch (error) {
                console.log("error", error);
                if (error instanceof Error) {
                    setError(error.message);
                }
            } finally {
                setIsLoading(false);
            }
        };

        getCommunityArticleComments();
    }, [articleId, refetchIndex]);

    const refetch = () => {
        setRefetchIndex((prevIndex) => prevIndex + 1);
        shouldInitializeLoadingRef.current = false;
    };

    return { data: comments, isLoading, refetch, error };
}
