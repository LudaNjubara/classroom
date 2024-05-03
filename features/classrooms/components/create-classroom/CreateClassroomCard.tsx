import { type FileState } from "@/components/Elements/dropzone/MultiFileDropzone";
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
import { TSelectedStudentItem } from "@/features/students";
import { TSelectedTeacherItem } from "@/features/teachers";
import { useDashboardStore } from "@/stores";
import { sanitizeInput } from "@/utils/misc";
import { zodResolver } from "@hookform/resolvers/zod";
import { XIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import * as z from "zod";
import { createClassroom, updateClassroom } from "../../api";
import { TClassroomSettings, TFileUploadResponseWithFilename, TScheduleItem } from "../../types";
import { ClassroomSettingsFormField } from "./ClassroomSettingsFormField";
import { ResourcesFormField } from "./ResourcesFormField";
import { ScheduleFormField } from "./ScheduleFormField";
import { StudentsFormField } from "./StudentsFormField";
import { TeachersFormField } from "./TeachersFormField";

const formSchema = z.object({
  name: z.string().min(1, { message: "Please enter a name." }),
  description: z.string().min(1, { message: "Please enter a description." }),
});

const initialScheduleItem: TScheduleItem = {
  id: uuidv4(),
  day: "Monday",
  startTime: "12:00",
  endTime: "1:00",
  startTimeAmPm: "PM",
  endTimeAmPm: "PM",
};

type TCreateClassroomCardProps = {
  toggleModal: () => void;
};

export function CreateClassroomCard({ toggleModal }: TCreateClassroomCardProps) {
  // zustan state and actions
  const selectedOrganization = useDashboardStore((state) => state.selectedOrganization);

  // state
  const [selectedStudentItems, setSelectedStudentItems] = useState<TSelectedStudentItem[]>([]);
  const [selectedTeacherItems, setSelectedTeacherItems] = useState<TSelectedTeacherItem[]>([]);
  const [fileStates, setFileStates] = useState<FileState[]>([]);
  const [scheduleItems, setScheduleItems] = useState<TScheduleItem[]>([initialScheduleItem]);
  const [classroomSettings, setClassroomSettings] = useState<TClassroomSettings>();
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);

  // hooks
  const { edgestore } = useEdgeStore();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onSubmit",
    defaultValues: {
      name: "",
      description: "",
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

  const handleFileUpload = async ({ classroomId }: { classroomId: string }) => {
    const uploadResponses: TFileUploadResponseWithFilename[] = [];

    await Promise.all(
      fileStates.map(async (fileState) => {
        try {
          if (fileState.progress !== "PENDING") return;
          const res = await edgestore.publicFiles.upload({
            input: { classroomId },
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
    if (!selectedOrganization) return;

    setIsFormSubmitting(true);

    try {
      const classroomRes = await createClassroom({
        studentItems: selectedStudentItems,
        teacherItems: selectedTeacherItems,
        classroomSettings,
        scheduleItems,
        organizationId: selectedOrganization?.id,
        classroom: {
          name: sanitizeInput(formData.name),
          description: sanitizeInput(formData.description),
        },
      });

      const uploadResponses = await handleFileUpload({ classroomId: classroomRes.classroom.id });

      if (uploadResponses.length) {
        await updateClassroom({
          resources: uploadResponses,
        });
      }

      toast({
        title: "Classroom created successfully",
        description: "The classroom has been created successfully.",
        variant: "default",
      });
    } catch (err) {
      console.error(err);

      toast({
        title: "Failed to create classroom",
        description: "An error occurred while creating the classroom. Please try again later.",
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
          <h2 className="text-2xl font-medium">Create a classroom</h2>
          <p className="text-slate-600">Create a new classroom where you can add students and teachers</p>
        </div>

        <div>
          <Button
            className="rounded-full bg-slate-500/30 hover:bg-slate-600/30 dark:bg-slate-600/30 hover:dark:bg-slate-500/30"
            onClick={toggleModal}
            size={"icon"}
          >
            <XIcon size={24} className="text-slate-600 dark:text-slate-600" />
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-8 mt-10">
        <StudentsFormField
          selectedStudentItems={selectedStudentItems}
          setSelectedStudentItems={setSelectedStudentItems}
          className="p-4 bg-slate-300 dark:bg-slate-950 rounded-lg border-2 border-slate-100 dark:border-slate-800 transition-colors duration-300 ease-in-out"
        />

        <TeachersFormField
          selectedTeacherItems={selectedTeacherItems}
          setSelectedTeacherItems={setSelectedTeacherItems}
          className="p-4 bg-slate-300 dark:bg-slate-950 rounded-lg border-2 border-slate-100 dark:border-slate-800 transition-colors duration-300 ease-in-out"
        />

        <ResourcesFormField
          fileStates={fileStates}
          setFileStates={setFileStates}
          className="p-4 bg-slate-300 dark:bg-slate-950 rounded-lg border-2 border-slate-100 dark:border-slate-800 transition-colors duration-300 ease-in-out"
        />

        <ClassroomSettingsFormField
          className="p-4 bg-slate-300 dark:bg-slate-950 rounded-lg border-2 border-slate-100 dark:border-slate-800 transition-colors duration-300 ease-in-out"
          classroomSettings={classroomSettings}
          setClassroomSettings={setClassroomSettings}
        />

        <ScheduleFormField
          className="p-4 bg-slate-300 dark:bg-slate-950 rounded-lg border-2 border-slate-100 dark:border-slate-800 transition-colors duration-300 ease-in-out"
          scheduleItems={scheduleItems}
          setScheduleItems={setScheduleItems}
        />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 gap-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Chemistry" {...field} />
                    </FormControl>
                    <FormDescription>Name of the classroom / subject</FormDescription>
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
                      <Textarea placeholder="Teaching secret potions and spells..." {...field} />
                    </FormControl>
                    <FormDescription>Here you describe what this classroom will teach about.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={toggleModal}>
                Cancel
              </Button>

              <Button type="submit" className="min-w-40" disabled={isFormSubmitting}>
                {isFormSubmitting ? <Spinner /> : "Create Classroom"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
