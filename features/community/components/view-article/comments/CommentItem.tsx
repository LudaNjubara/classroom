import { ArticleComment } from "@prisma/client";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { ClockIcon } from "lucide-react";

dayjs.extend(relativeTime);

type TCommentItemProps = {
  comment: ArticleComment;
};

export default function CommentItem({ comment }: TCommentItemProps) {
  return (
    <div className="dark:bg-slate-800 p-4 rounded-md">
      <div className="flex items-start gap-4">
        <img src={comment.authorPicture} alt="Author Profile Image" className="w-10 h-10 rounded-full" />

        <div>
          <h4 className="text-base font-semibold text-muted-foreground">{comment.authorName}</h4>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <span>
              <ClockIcon size={16} />
            </span>{" "}
            <p>{dayjs().from(comment.createdAt, true)} ago</p>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-sm text-slate-600 dark:text-slate-400">{comment.content}</p>
      </div>
    </div>
  );
}
