import { ArticleCommentsSkeleton } from "@/components/Loaders";
import { useCommunityArticleComments } from "@/features/community/hooks";
import Image from "next/image";
import { CommentForm } from "./CommentForm";
import CommentItem from "./CommentItem";

type TArticleCommentsProps = {
  articleId: string;
};
export function ArticleComments({ articleId }: TArticleCommentsProps) {
  const {
    data: comments,
    isLoading: isCommentsLoading,
    error: commentsError,
    refetch: refetchComments,
  } = useCommunityArticleComments({
    articleId,
  });

  return (
    <div className="mt-12 dark:bg-slate-900 p-4 rounded-xl">
      <h2 className="text-xl">Comments</h2>

      {/* Post a comment */}
      <div className="mt-4">
        <CommentForm articleId={articleId} onCommentPosted={refetchComments} />
      </div>

      {/* View posted comments */}
      <ul className="flex flex-col gap-2 mt-8">
        {isCommentsLoading && <ArticleCommentsSkeleton />}

        {!isCommentsLoading &&
          comments &&
          comments.map((comment) => (
            <li key={comment.id}>
              <CommentItem comment={comment} />
            </li>
          ))}

        {!isCommentsLoading && comments.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-5 py-8 tracking-wide">
            <Image src="/no-comments.svg" alt="No comments" width={250} height={250} className="opacity-50" />
            <p className="text-slate-500 text-lg font-semibold">No comments yet</p>
          </div>
        )}
      </ul>
    </div>
  );
}
