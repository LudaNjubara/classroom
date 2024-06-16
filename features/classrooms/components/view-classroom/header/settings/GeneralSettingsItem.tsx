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
import { updateClassroom } from "@/features/classrooms/api";
import { useDashboardStore } from "@/stores";
import { sanitizeInput } from "@/utils/misc";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { formSchema as classroomFormSchema } from "../../../create-classroom";

export function GeneralSettingsItem() {
  // zustan state and actions
  const selectedOrganization = useDashboardStore((state) => state.selectedOrganization);
  const selectedClassroom = useDashboardStore((state) => state.selectedClassroom);

  // state
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);

  const form = useForm<z.infer<typeof classroomFormSchema>>({
    resolver: zodResolver(classroomFormSchema),
    mode: "onSubmit",
    defaultValues: {
      name: selectedClassroom?.name || "",
      description: selectedClassroom?.description || "",
    },
  });

  // hooks
  const { toast } = useToast();

  // handlers
  const onSubmit = async (formData: z.infer<typeof classroomFormSchema>) => {
    if (!selectedOrganization || !selectedClassroom) return;

    setIsFormSubmitting(true);

    try {
      await updateClassroom({
        classroom: {
          id: selectedClassroom.id,
          name: sanitizeInput(formData.name),
          description: sanitizeInput(formData.description),
        },
      });

      toast({
        title: "Settings saved",
        description: "Classroom settings have been saved successfully.",
        variant: "default",
      });
    } catch (err) {
      console.error(err);

      toast({
        title: "Failed to save settings",
        description: "An error occurred while saving the classroom settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsFormSubmitting(false);
    }
  };

  return (
    <div>
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
            <Button type="submit" className="min-w-40" disabled={isFormSubmitting}>
              {isFormSubmitting ? <Spinner /> : "Save General settings"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
