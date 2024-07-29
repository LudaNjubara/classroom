
import { Article, ArticleType } from "@prisma/client";
import { useEffect, useRef, useState } from "react";
import { fetchCommunityArticles } from "../api";

type TUseCommunityArticlesProps = {
    organizationId?: string;
    articleType?: ArticleType;
};

export function useCommunityArticles({
    organizationId,
    articleType,
}: TUseCommunityArticlesProps) {
    const [articles, setArticles] = useState<Article[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [refetchIndex, setRefetchIndex] = useState(0);

    const shouldInitializeLoadingRef = useRef(true);

    useEffect(() => {
        const getCommunityArticles = async () => {
            setIsLoading(shouldInitializeLoadingRef.current);

            const requestData = { organizationId, articleType };

            try {
                const { data } = await fetchCommunityArticles(requestData);

                setArticles(data);
            } catch (error) {
                console.log("error", error);
                if (error instanceof Error) {
                    setError(error.message);
                }
            } finally {
                setIsLoading(false);
            }
        };

        getCommunityArticles();
    }, [organizationId, articleType, refetchIndex]);

    const refetch = () => {
        setRefetchIndex((prevIndex) => prevIndex + 1);
        shouldInitializeLoadingRef.current = false;
    };

    return { data: articles, isLoading, refetch };
}

