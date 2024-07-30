import { Spinner } from "@/components/Loaders";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { createCommunityArticleComment } from "@/features/community/api";
import { sanitizeInput } from "@/utils/misc";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  content: z.string().min(1, { message: "Please enter the content of the comment." }),
});

type TCommentFormProps = {
  onCommentPosted: () => void;
  articleId: string;
};

export function CommentForm({ onCommentPosted, articleId }: TCommentFormProps) {
  // state
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);

  // hooks
  const form = useForm({
    resolver: zodResolver(formSchema),
    mode: "onSubmit",
    defaultValues: {
      content: "",
    },
  });

  // handlers
  const onSubmit = async (formData: z.infer<typeof formSchema>) => {
    try {
      setIsFormSubmitting(true);

      const articleComment = await createCommunityArticleComment({
        articleId,
        content: sanitizeInput(formData.content),
      });

      onCommentPosted();
      toast({
        title: "Comment posted",
        description: "Your comment has been posted successfully.",
        variant: "default",
      });
      form.reset();
    } catch (error) {
      toast({
        title: "Failed to post comment",
        description: error instanceof Error ? error.message : "An error occurred while posting the comment.",
        variant: "destructive",
      });
    } finally {
      setIsFormSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 gap-8">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea placeholder="Here are my thoughts..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button type="submit" className="min-w-40" disabled={isFormSubmitting}>
            {isFormSubmitting ? <Spinner /> : "Post Comment"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
