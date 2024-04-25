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
import { TSelectedStudentItem } from "@/features/students";
import { TSelectedTeacherItem } from "@/features/teachers";
import { zodResolver } from "@hookform/resolvers/zod";
import { XIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { ResourcesFormField } from "./ResourcesFormField";
import { StudentsFormField } from "./StudentsFormField";
import { TeachersFormField } from "./TeachersFormField";

const formSchema = z.object({
  name: z.string().min(1, { message: "Please enter a name." }),
  description: z.string().min(1, { message: "Please enter a description." }),
});

type TCreateClassroomCardProps = {
  toggleModal: () => void;
};

export function CreateClassroomCard({ toggleModal }: TCreateClassroomCardProps) {
  // state
  const [selectedStudentItems, setSelectedStudentItems] = useState<TSelectedStudentItem[]>([]);
  const [selectedTeacherItems, setSelectedTeacherItems] = useState<TSelectedTeacherItem[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onSubmit",
    defaultValues: {
      name: "",
      description: "",
    },
  });

  // handlers
  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log(data);
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

        <ResourcesFormField className="p-4 bg-slate-300 dark:bg-slate-950 rounded-lg border-2 border-slate-100 dark:border-slate-800 transition-colors duration-300 ease-in-out" />

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

            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
