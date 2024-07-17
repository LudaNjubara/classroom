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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useEdgeStore } from "@/config/edgestore";
import { createClassroomAssignment } from "@/features/classrooms/api/create-classroom-assignment";
import { updateClassroomAssignment } from "@/features/classrooms/api/update-classroom-assignment";
import { ResourcesFormField } from "@/features/classrooms/components/create-classroom/ResourcesFormField";
import { TFileUploadResponseWithFilename } from "@/features/classrooms/types";
import { sanitizeInput } from "@/utils/misc";
import { zodResolver } from "@hookform/resolvers/zod";
import { XIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  title: z.string().min(1, { message: "Please enter a title." }),
  description: z.string().min(1, { message: "Please enter a description." }),
  dueDate: z.string().min(1, { message: "Please enter a due date." }),
});

type TCreateNewAssignmentModalProps = {
  onClose: () => void;
  classroomId: string;
  onAssignmentCreated: () => void;
};

export function CreateNewAssignmentModal({
  onClose,
  classroomId,
  onAssignmentCreated,
}: TCreateNewAssignmentModalProps) {
  // state
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const [fileStates, setFileStates] = useState<FileState[]>([]);

  // hooks
  const form = useForm({
    resolver: zodResolver(formSchema),
    mode: "onSubmit",
    defaultValues: {
      title: "",
      description: "",
      dueDate: "",
    },
  });

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

  const onSubmit = async (formData: z.infer<typeof formSchema>) => {
    setIsFormSubmitting(true);

    try {
      // create assignment
      const classroomAssignmentRes = await createClassroomAssignment({
        classroomId,
        title: sanitizeInput(formData.title),
        description: sanitizeInput(formData.description),
        dueDate: sanitizeInput(formData.dueDate),
      });

      const uploadResponses = await handleFileUpload({
        classroomId,
        assignmentId: classroomAssignmentRes.assignment.id,
      });

      if (uploadResponses.length) {
        await updateClassroomAssignment({
          assignmentResources: {
            assignmentId: classroomAssignmentRes.assignment.id,
            resources: uploadResponses,
          },
        });
      }

      toast({
        title: "Assignment created",
        description: "The assignment has been created successfully.",
        variant: "default",
      });

      // refetch assignments
      onAssignmentCreated();
    } catch (error) {
      console.error(error);
      toast({
        title: "Failed to create assignment",
        description:
          error instanceof Error ? error.message : "An error occurred while creating the assignment.",
        variant: "destructive",
      });
    } finally {
      setIsFormSubmitting(false);
    }
  };

  return (
    <div className="pb-4">
      <div className="flex justify-between">
        <div>
          <h2 className="text-2xl font-medium">Create an assignment</h2>
          <p className="text-slate-600">
            Create a new assignment for which the students will provide solutions. Note that this assignment
            is related to the current classroom only.
          </p>
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
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title *</FormLabel>
                    <FormControl>
                      <Input placeholder="Final thesis" {...field} />
                    </FormControl>
                    <FormDescription>Title of the assignment</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Due date *</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormDescription>When is this assignment due?</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description *</FormLabel>
                    <FormControl>
                      <Textarea placeholder="..." {...field} />
                    </FormControl>
                    <FormDescription>
                      Here you describe in as much detail what this assignment expects of students.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <ResourcesFormField
                description="Add resources to help students complete the assignment."
                fileStates={fileStates}
                setFileStates={setFileStates}
                className="p-4 bg-slate-300 dark:bg-slate-950 rounded-lg border-2 border-slate-100 dark:border-slate-800 transition-colors duration-300 ease-in-out"
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>

              <Button type="submit" className="min-w-40" disabled={isFormSubmitting}>
                {isFormSubmitting ? <Spinner /> : "Create Assignment"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
