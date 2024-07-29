import { GridView } from "@/components/Elements";
import { CommunityArticleItemSkeleton } from "@/components/Loaders";
import { Article, ArticleType } from "@prisma/client";
import { Dispatch, SetStateAction } from "react";
import { useCommunityArticles } from "../../hooks";
import { ArticleItem } from "./";

type TViewArticlesProps = {
  organizationId: string;
  activeTab: "all" | "organization";
  articleType?: ArticleType;
  setSelectedArticle: Dispatch<SetStateAction<Article | null>>;
};

export function ViewArticles({
  organizationId,
  activeTab,
  articleType,
  setSelectedArticle,
}: TViewArticlesProps) {
  // hooks
  const { data: communityArticles, isLoading: isCommunityArticlesLoading } = useCommunityArticles({
    organizationId: activeTab === "organization" ? organizationId : undefined,
    articleType,
  });

  return (
    <div>
      {isCommunityArticlesLoading && (
        <GridView className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3 py-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <CommunityArticleItemSkeleton key={i} />
          ))}
        </GridView>
      )}
      {communityArticles && (
        <GridView className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {communityArticles.map((article) => (
            <ArticleItem key={article.id} article={article} onClick={setSelectedArticle} />
          ))}
        </GridView>
      )}
    </div>
  );
}
