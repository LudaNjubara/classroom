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
import { useToast } from "@/components/ui/use-toast";
import { useEdgeStore } from "@/config/edgestore";
import { createAssignmentSolution } from "@/features/classrooms/api/create-classroom-assignment-solution";
import { ResourcesFormField } from "@/features/classrooms/components/create-classroom/ResourcesFormField";
import { TFileUploadResponseWithFilename } from "@/features/classrooms/types";
import { useDashboardStore } from "@/stores";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  note: z.string().optional(),
});

type TAssignmentSolutionStudentSectionProps = {
  assignmentId: string;
  onClose: () => void;
};

export function AssignmentSolutionStudentSection({
  assignmentId,
  onClose,
}: TAssignmentSolutionStudentSectionProps) {
  // zustand state and actions
  const selectedClassroom = useDashboardStore((state) => state.selectedClassroom);

  // state
  const [fileStates, setFileStates] = useState<FileState[]>([]);
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);

  // hooks
  const { edgestore } = useEdgeStore();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onSubmit",
    defaultValues: {
      note: "",
    },
  });

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

  const handleFileUpload = async ({
    classroomId,
    assignmentId,
  }: {
    classroomId: string;
    assignmentId: string;
  }) => {
    const uploadResponses: TFileUploadResponseWithFilename[] = [];

    await Promise.all(
      fileStates.map(async (fileState) => {
        try {
          if (fileState.progress !== "PENDING") return;
          const res = await edgestore.publicFiles.upload({
            input: { classroomId, assignmentId },
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

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!fileStates.length || !selectedClassroom) return;

    try {
      setIsFormSubmitting(true);

      const uploadResponses = await handleFileUpload({
        classroomId: selectedClassroom.id,
        assignmentId,
      });

      const res = await createAssignmentSolution({
        assignmentId,
        note: values.note,
        resources: uploadResponses,
      });

      toast({
        title: "Solution posted successfully",
        description: "Your solution has been posted successfully. Please wait for the teacher to review it.",
        variant: "default",
      });

      setFileStates([]);
      form.reset();
    } catch (error) {
      console.error(error);

      toast({
        title: "Failed to post solution",
        description:
          error instanceof Error ? error.message : "Failed to post your solution. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsFormSubmitting(false);
    }
  };

  return (
    <div>
      <ResourcesFormField
        fileStates={fileStates}
        setFileStates={setFileStates}
        description="Here you upload files that will be a part of the solution you are about to submit."
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 space-y-8">
          <div className="grid grid-cols-1 gap-8">
            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Note</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Something curious here..."
                      className="bg-slate-950/50 placeholder:text-slate-500"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Note for the teacher</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>

            <Button type="submit" className="min-w-40" disabled={!fileStates.length || isFormSubmitting}>
              {isFormSubmitting ? <Spinner /> : "Post solution"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
