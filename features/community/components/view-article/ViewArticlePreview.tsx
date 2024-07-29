import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/utils/misc";
import { XIcon } from "lucide-react";
import { TCommunityArticlePreview } from "../../types";
import { ArticleTag } from "../common";

type TViewArticlePreviewProps = {
  onClose: () => void;
  articlePreview: TCommunityArticlePreview;
};

export function ViewArticlePreview({ articlePreview, onClose }: TViewArticlePreviewProps) {
  return (
    <div className="pb-4">
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
          <p className="text-muted-foreground">Published on: {formatDateTime(new Date())}</p>
          <p className="text-muted-foreground">Last edited: {formatDateTime(new Date())}</p>
        </div>

        <div className="flex items-center gap-2 mt-8">
          {articlePreview.tags.split(",").map((tag) => (
            <ArticleTag key={tag} tag={tag} />
          ))}
        </div>

        <h1 className="text-3xl font-semibold mt-3">{articlePreview.title}</h1>

        <p
          className={`text-lg text-slate-600 dark:text-slate-400 mt-4 ${
            !articlePreview.description && "opacity-30 pointer-events-none"
          }`}
        >
          <span className="bg-slate-800 rounded-lg py-1 px-3 text-lg font-medium mr-2">TL;DR</span>
          {articlePreview.description ? articlePreview.description : "No description provided"}
        </p>

        <div className="mt-5">
          {articlePreview.imageUrl ? (
            <img
              src={articlePreview.imageUrl}
              alt={articlePreview.imageFileName}
              className="w-full h-96 object-cover rounded-lg border-2 border-slate-500/10"
            />
          ) : (
            <p className="italic text-muted-foreground text-lg">No image provided</p>
          )}
        </div>

        <p className="block mt-5 text-lg text-slate-600 dark:text-slate-400 break-words">
          {articlePreview.content}
        </p>
      </div>
    </div>
  );
}
