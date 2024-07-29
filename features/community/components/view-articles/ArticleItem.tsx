import { formatDateTime } from "@/utils/misc";
import { Article } from "@prisma/client";
import { Dispatch, SetStateAction } from "react";
import { ArticleTag } from "../common";

type TArticleItemProps = {
  article: Article;
  onClick: Dispatch<SetStateAction<Article | null>>;
};

export function ArticleItem({ article, onClick }: TArticleItemProps) {
  return (
    <div
      className="rounded-xl group cursor-pointer overflow-hidden dark:bg-slate-900"
      onClick={() => onClick(article)}
    >
      {/* Image container */}
      <div className="object-cover min-h-28 max-h-48 overflow-hidden">
        <img
          src={article.imageURL}
          alt={article.title}
          className="group-hover:scale-105 transition-transform duration-500 ease-in-out"
        />
      </div>

      {/* Content container */}
      <div className="p-4">
        <div className="flex items-center gap-2 pb-2">
          {article.tags.split(",").map((tag) => (
            <ArticleTag key={tag} tag={tag} />
          ))}
        </div>

        <h2 className="text-xl font-semibold mt-2">{article.title}</h2>

        <p className="line-clamp-1 text-slate-600 dark:text-slate-400 mt-2">{article.description}</p>

        <div className="flex items-center gap-2 mt-4">
          <p className="text-muted-foreground text-sm">
            Published on: {formatDateTime(new Date(article.createdAt))}
          </p>
        </div>
      </div>
    </div>
  );
}
