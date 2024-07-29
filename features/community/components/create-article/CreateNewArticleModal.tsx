import { CustomModal } from "@/components/Elements";
import { FileState } from "@/components/Elements/dropzone/MultiFileDropzone";
import { Spinner } from "@/components/Loaders";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useEdgeStore } from "@/config/edgestore";
import { ResourcesFormField } from "@/features/classrooms/components/create-classroom/ResourcesFormField";
import { TFileUploadResponseWithFilename } from "@/features/classrooms/types";
import { useDisclosure } from "@/hooks/useDisclosure";
import { useMiscStore } from "@/stores";
import { sanitizeInput } from "@/utils/misc";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArticleType } from "@prisma/client";
import { XIcon } from "lucide-react";
import { useState } from "react";
import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { createCommunityArticle } from "../../api";
import { TCommunityArticlePreview } from "../../types";
import { ViewArticlePreview } from "../view-article";

const formSchema = z.object({
  title: z.string().min(1, { message: "Please enter a title." }),
  description: z.string(),
  content: z.string().min(1, { message: "Content is required." }),
  tags: z.string().min(1, { message: "Please add at least one tag." }),
  is_public: z.boolean().default(true),
  type: z.nativeEnum(ArticleType),
});

type TCreateNewArticleModalProps = {
  onClose: () => void;
  organizationId?: string;
  onArticleCreated: () => void;
};

export function CreateNewArticleModal({
  onClose,
  organizationId,
  onArticleCreated,
}: TCreateNewArticleModalProps) {
  // zustand state and actions
  const numOfModalsOpen = useMiscStore((state) => state.numOfModalsOpen);

  // state
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false);
  const [fileStates, setFileStates] = useState<FileState[]>([]);
  const [preview, setPreview] = useState<TCommunityArticlePreview>({
    title: "",
    description: "",
    content: "",
    tags: "",
    imageUrl: "",
    imageFileName: "",
  });

  // hooks
  const form = useForm({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      is_public: true,
      type: ArticleType.ARTICLE,
      title: "",
      description: "",
      content: "",
      tags: "",
    },
  });

  const { isOpen: isPreviewModalOpen, toggle: togglePreviewModal } = useDisclosure();
  const { edgestore } = useEdgeStore();
  const { toast } = useToast();

  // handlers
  const updateFileProgress = (key: string, progress: FileState["progress"]) => {
    setFileStates((fileStates) => {
      const newFileStates = structuredClone(fileStates);
      const fileState = newFileStates.find((fileState) => fileState.key === key);
      if (fileState) {
        fileState.progress = progress;
      }
      return newFileStates;
    });
  };

  const handleFileUpload = async () => {
    const uploadResponses: TFileUploadResponseWithFilename[] = [];

    await Promise.all(
      fileStates.map(async (fileState) => {
        try {
          if (fileState.progress !== "PENDING") return;

          const res = await edgestore.publicFiles.upload({
            input: {},
            options: {
              temporary: true,
            },
            file: fileState.file,
            onProgressChange: async (progress) => {
              updateFileProgress(fileState.key, progress);
              if (progress === 100) {
                // wait 1 second to set it to complete
                // so that the user can see the progress bar
                await new Promise((resolve) => setTimeout(resolve, 1000));
                updateFileProgress(fileState.key, "COMPLETE");
              }
            },
          });
          uploadResponses.push({ ...res, filename: fileState.file.name });
        } catch (err) {
          updateFileProgress(fileState.key, "ERROR");
        }
      })
    );

    return uploadResponses;
  };

  const handlePreview = async () => {
    if (
      fileStates.length === 0 ||
      form.getFieldState("title").invalid ||
      form.getValues().title.length === 0 ||
      form.getFieldState("content").invalid ||
      form.getValues().content.length === 0 ||
      form.getFieldState("tags").invalid ||
      form.getValues().tags.length === 0
    ) {
      console.log(form.getFieldState("tags").invalid);
      toast({
        title: "Invalid form",
        description: "Please fill in the required fields and upload an image to preview the article.",
        variant: "destructive",
      });
    } else if (fileStates.length > 0) {
      // There exists an image, check if the image is the same as the one in the preview
      const imageFileName = fileStates[0].file.name;

      if (imageFileName !== preview.imageFileName) {
        setIsGeneratingPreview(true);

        try {
          // The image is different, re-upload the image
          const uploadResponses = await handleFileUpload();

          // Get the first (and only) image and display the preview in a modal
          const imageUrl = uploadResponses[0].url;

          setPreview({
            title: form.getValues("title"),
            description: form.getValues("description"),
            content: form.getValues("content"),
            tags: form.getValues("tags"),
            imageUrl,
            imageFileName,
          });

          togglePreviewModal();
        } catch (error) {
          console.error(error);

          toast({
            title: "Failed to generate preview",
            description: "An error occurred while generating the preview. Please try again later.",
            variant: "destructive",
          });
        } finally {
          setIsGeneratingPreview(false);
        }
      } else {
        // The image is the same, display the preview in a modal;

        setPreview((prev) => ({
          ...prev,
          title: form.getValues("title"),
          description: form.getValues("description"),
          content: form.getValues("content"),
          tags: form.getValues("tags"),
        }));

        togglePreviewModal();
      }
    }
  };

  const onSubmit = async (formData: z.infer<typeof formSchema>) => {
    setIsFormSubmitting(true);

    // check if there is an image uploaded already
    if (fileStates.length === 0) {
      toast({
        title: "No image uploaded",
        description: "Please upload an image to create the article.",
        variant: "destructive",
      });

      setIsFormSubmitting(false);
      return;
    }

    const tags = sanitizeInput(formData.tags).split(",");

    if (tags.length === 0) {
      toast({
        title: "No tags added",
        description: "Please add at least one tag to the article.",
        variant: "destructive",
      });

      setIsFormSubmitting(false);
      return;
    }

    try {
      let imageURL = preview.imageUrl;
      let uploadResponses: TFileUploadResponseWithFilename[] = [];

      if (!imageURL) {
        uploadResponses = await handleFileUpload();

        imageURL = uploadResponses[0].url;
      }

      // create assignment
      const communityArticleRes = await createCommunityArticle({
        organizationId: form.getValues("is_public") ? undefined : organizationId,
        title: sanitizeInput(formData.title),
        description: formData.description && sanitizeInput(formData.description),
        content: sanitizeInput(formData.content),
        tags,
        imageURL,
        type: formData.type,
      });

      toast({
        title: "Article created",
        description: "The article has been created successfully.",
        variant: "default",
      });

      // refetch articles
      onArticleCreated();
    } catch (error) {
      console.error(error);
      toast({
        title: "Failed to create article",
        description: error instanceof Error ? error.message : "An error occurred while creating the article.",
        variant: "destructive",
      });
    } finally {
      setIsFormSubmitting(false);
    }
  };

  return (
    <div className={`${numOfModalsOpen > 1 && "h-0 overflow-hidden"} pb-4`} id="create-article-container">
      <div className="flex justify-between">
        <div>
          <h2 className="text-2xl font-medium">Create an article</h2>
          <p className="text-slate-600">Create a new article for the community.</p>
        </div>

        <div>
          <Button
            className="rounded-full bg-slate-500/30 hover:bg-slate-600/30 dark:bg-slate-600/30 hover:dark:bg-slate-500/30"
            onClick={onClose}
            size={"icon"}
          >
            <XIcon size={24} className="text-slate-600 dark:text-slate-600" />
          </Button>
        </div>
      </div>

      <div className="mt-10">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 gap-8">
              <FormField
                control={form.control}
                name="is_public"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Article visibility</FormLabel>
                      <FormDescription className="w-4/5">
                        Choose whether this article should be public, meaning it will be visible to the whole
                        community. If not public, the article will only be visible to the current
                        organization.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={!organizationId}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Article type</FormLabel>
                      <FormDescription className="w-4/5">
                        Choose the type of article you are creating. This will help categorize the article.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Select defaultValue={ArticleType.ARTICLE}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Article type" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(ArticleType).map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="How statistics improved the student assignment completion rate..."
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Title of the article</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input placeholder="..." {...field} />
                    </FormControl>
                    <FormDescription>
                      A TL;DR of the article. Provide an optional brief description of the article.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content *</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormDescription>Write the article content here.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags *</FormLabel>
                    <FormControl>
                      <Input placeholder="statistics, assignment, student" {...field} />
                    </FormControl>
                    <FormDescription>
                      Tags help categorize the article. Separate them with commas.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <ResourcesFormField
                description="Add an image for the article."
                maxFiles={1}
                fileStates={fileStates}
                setFileStates={setFileStates}
                className="p-4 bg-slate-300 dark:bg-slate-950 rounded-lg border-2 border-slate-100 dark:border-slate-800 transition-colors duration-300 ease-in-out"
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>

              <Button
                type="button"
                variant="secondary"
                className="min-w-36"
                onClick={handlePreview}
                disabled={isGeneratingPreview || isFormSubmitting}
              >
                {isGeneratingPreview ? <Spinner /> : "Preview Article"}
              </Button>

              <Button type="submit" className="min-w-36" disabled={isFormSubmitting || isGeneratingPreview}>
                {isFormSubmitting ? <Spinner /> : "Post Article"}
              </Button>
            </div>
          </form>
        </Form>
      </div>

      {/* Preview article modal */}
      {isPreviewModalOpen &&
        createPortal(
          <CustomModal className="z-10">
            <ViewArticlePreview onClose={togglePreviewModal} articlePreview={preview} />
          </CustomModal>,
          document.getElementById("view-articles-container")!
        )}
    </div>
  );
}
