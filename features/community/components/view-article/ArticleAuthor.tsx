type TArticleAuthorProps = {
  author: any;
};

export function ArticleAuthor({ author }: TArticleAuthorProps) {
  return (
    <div className="flex items-start gap-4">
      <img src={author.profile.picture} alt={author.name} className="w-10 h-10 rounded-full" />

      <div className="-mt-1">
        <p className="text-lg font-semibold">{author.name}</p>
        <p className="text-sm text-muted-foreground">{author.profile.role}</p>
      </div>
    </div>
  );
}
