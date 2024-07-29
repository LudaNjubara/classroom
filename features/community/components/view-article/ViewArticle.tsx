import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/utils/misc";
import { Article } from "@prisma/client";
import { XIcon } from "lucide-react";
import { ArticleTag } from "../common";

type TViewArticleProps = {
  onClose: () => void;
  article: Article;
};

export function ViewArticle({ article, onClose }: TViewArticleProps) {
  return (
    <div className="pb-8">
      <div className="mt-2 px-5 pb-4">
        <div className="flex justify-end">
          <Button
            className="rounded-full bg-slate-500/30 hover:bg-slate-600/30 dark:bg-slate-600/30 hover:dark:bg-slate-500/30"
            onClick={onClose}
            size={"icon"}
          >
            <XIcon size={24} className="text-slate-600 dark:text-slate-600" />
          </Button>
        </div>
      </div>

      <div className="mt-5">
        <div className="flex items-center gap-4 text-sm">
          <p className="text-muted-foreground">Published on: {formatDateTime(new Date(article.createdAt))}</p>
          <p className="text-muted-foreground">Last edited: {formatDateTime(new Date(article.updatedAt))}</p>
        </div>

        <div className="flex items-center gap-2 mt-8">
          {article.tags.split(",").map((tag) => (
            <ArticleTag key={tag} tag={tag} />
          ))}
        </div>

        <h1 className="text-3xl font-semibold mt-3">{article.title}</h1>

        <p
          className={`text-lg text-slate-600 dark:text-slate-400 mt-4 ${
            !article.description && "opacity-30 pointer-events-none"
          }`}
        >
          <span className="bg-slate-800 rounded-lg py-1 px-3 text-lg font-medium mr-2">TL;DR</span>
          {article.description ? article.description : "No description provided"}
        </p>

        <div className="mt-5">
          {article.imageURL ? (
            <img
              src={article.imageURL}
              alt="Article image"
              className="w-full h-96 object-cover rounded-lg border-2 border-slate-500/10"
            />
          ) : (
            <p className="italic text-muted-foreground text-lg">No image provided</p>
          )}
        </div>

        <p className="mt-5 text-lg text-slate-600 dark:text-slate-400">{article.content}</p>
      </div>
    </div>
  );
}
