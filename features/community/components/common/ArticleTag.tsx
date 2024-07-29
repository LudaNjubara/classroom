import { Badge } from "@/components/ui/badge";

type TArticleTagProps = {
  tag: string;
};

export function ArticleTag({ tag }: TArticleTagProps) {
  return <Badge>{tag}</Badge>;
}
