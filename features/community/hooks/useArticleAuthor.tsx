import { ArticleUserType } from "@prisma/client";
import { useEffect, useRef, useState } from "react";
import { fetchCommunityArticleAuthor } from "../api";

type TUseCommunityArticlesProps = {
  authorId: string;
  authorRole: ArticleUserType;
};

export function useCommunityArticleAuthor({ authorId, authorRole }: TUseCommunityArticlesProps) {
  const [author, setAuthor] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refetchIndex, setRefetchIndex] = useState(0);

  const shouldInitializeLoadingRef = useRef(true);

  useEffect(() => {
    const getCommunityArticleAuthor = async () => {
      setIsLoading(shouldInitializeLoadingRef.current);

      const requestData = { authorId, authorRole };

      try {
        const { data } = await fetchCommunityArticleAuthor(requestData);

        setAuthor(data);
      } catch (error) {
        console.log("error", error);
        if (error instanceof Error) {
          setError(error.message);
        }
      } finally {
        setIsLoading(false);
      }
    };

    getCommunityArticleAuthor();
  }, [authorId, authorRole, refetchIndex]);

  const refetch = () => {
    setRefetchIndex((prevIndex) => prevIndex + 1);
    shouldInitializeLoadingRef.current = false;
  };

  return { data: author, isLoading, refetch, error };
}
