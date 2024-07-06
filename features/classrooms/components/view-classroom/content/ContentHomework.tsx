import { CustomModal, GridView } from "@/components/Elements";
import { NotificationSkeleton, Spinner } from "@/components/Loaders";
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/components/ui/use-toast";
import { useDashboardContext } from "@/context";
import { createClassroomAssignment } from "@/features/classrooms/api/create-classroom-assignment";
import { useClassroomAssignments } from "@/features/classrooms/hooks/useClassroomAssignments";
import { TClassroomAssignmentWithTeacher } from "@/features/classrooms/types";
import { useDisclosure } from "@/hooks/useDisclosure";
import { useDashboardStore } from "@/stores";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon, RotateCwIcon, XIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { createPortal } from "react-dom";
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

function CreateNewAssignmentModal({
  onClose,
  classroomId,
  onAssignmentCreated,
}: TCreateNewAssignmentModalProps) {
  // state
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);

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

  const { toast } = useToast();

  // handlers
  const onSubmit = async (formData: z.infer<typeof formSchema>) => {
    setIsFormSubmitting(true);

    try {
      // create assignment
      await createClassroomAssignment({
        classroomId,
        title: formData.title,
        description: formData.description,
        dueDate: formData.dueDate,
      });

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

type TCLassroomAssignmentListProps = {
  assignments: TClassroomAssignmentWithTeacher[];
  onRefetch: () => void;
};

function ClassroomAssignmentList({ assignments, onRefetch }: TCLassroomAssignmentListProps) {
  return (
    <div className="flex flex-col gap-4 p-5 rounded-lg border border-slate-700/50">
      <div className="flex justify-between items-center gap-2">
        <h2 className="text-xl font-semibold">Assignments</h2>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button onClick={onRefetch} className="self-end rounded-full" variant="ghost" size="icon">
                <RotateCwIcon size={24} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Refresh assignments</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Assignment list */}
      <ul>
        {assignments.map((assignment) => (
          <li key={assignment.id}>
            <p>{assignment.title}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ContentHomework() {
  // context
  const { profile } = useDashboardContext();
  // zustand state and actions
  const selectedClassroom = useDashboardStore((state) => state.selectedClassroom);

  // hooks
  const {
    data: classroomAssignments,
    isLoading: isClassroomAssignmentsLoading,
    refetch: refetchClassroomAssign,
  } = useClassroomAssignments(selectedClassroom?.id);

  const { isOpen: isCreateNewAssignmentModalOpen, toggle: toggleCreateNewAssignmentModal } = useDisclosure();

  return (
    <div className="relative pb-4">
      {/* Homework content */}
      {isClassroomAssignmentsLoading && (
        <GridView className="md:grid-cols-1 lg:grid-cols-1 gap-2">
          {[...Array(5)].map((_, index) => (
            <NotificationSkeleton key={index} />
          ))}
        </GridView>
      )}

      {!isClassroomAssignmentsLoading && classroomAssignments.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-5 py-8 tracking-wide">
          <Image src="/no-assignments.svg" alt="No assignments" width={300} height={300} />
          <p className="text-slate-500 text-lg font-semibold">No assignments yet</p>
        </div>
      )}

      {!isClassroomAssignmentsLoading && classroomAssignments.length > 0 && (
        <ClassroomAssignmentList assignments={classroomAssignments} onRefetch={refetchClassroomAssign} />
      )}

      {/* New assignment button container */}
      {profile.role === "TEACHER" && (
        <div className="absolute bottom-4 right-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={toggleCreateNewAssignmentModal}
                  size="icon"
                  variant="default"
                  className="rounded-full"
                >
                  <PlusIcon size={24} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Create new assignment</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}

      {/* Create new assignment modal */}
      {isCreateNewAssignmentModalOpen &&
        createPortal(
          <CustomModal>
            <CreateNewAssignmentModal
              onClose={toggleCreateNewAssignmentModal}
              classroomId={selectedClassroom?.id!}
              onAssignmentCreated={() => {
                refetchClassroomAssign();
                toggleCreateNewAssignmentModal();
              }}
            />
          </CustomModal>,
          document.getElementById("view-classroom-container")!
        )}
    </div>
  );
}
