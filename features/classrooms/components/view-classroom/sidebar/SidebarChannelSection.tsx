import { ClassroomChannelSkeleton } from "@/components/Loaders";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { createChannel } from "@/features/classrooms/api/create-channel";
import { useClassroomChannels } from "@/features/classrooms/hooks/useClassroomChannels";
import { useDashboardStore } from "@/stores";
import { cn } from "@/utils/cn";
import { zodResolver } from "@hookform/resolvers/zod";
import { ClassroomChannel } from "@prisma/client";
import { HashIcon, PlusIcon, SparklesIcon } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import { useMediaQuery } from "usehooks-ts";
import * as z from "zod";

const formSchema = z.object({
  channelName: z.string().min(2, { message: "Please enter a channel name with at least 2 characters." }),
});

type TAddChannelFormProps = {
  className?: string;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
};

const AddChannelForm = ({ className, setIsModalOpen }: TAddChannelFormProps) => {
  const selectedClassroom = useDashboardStore((state) => state.selectedClassroom);
  // hooks
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onSubmit",
    defaultValues: {
      channelName: "",
    },
  });

  // handlers
  const onSubmit = async (formData: z.infer<typeof formSchema>) => {
    if (!selectedClassroom) return;

    try {
      await createChannel({
        channel: {
          name: formData.channelName,
          metadata: {
            classroomId: selectedClassroom.id,
            organizationId: selectedClassroom.organizationId,
          },
        },
      });

      form.reset();

      setIsModalOpen(false);

      toast({
        title: "Channel created",
        description: `The channel #${formData.channelName} has been created.`,
        variant: "default",
      });
    } catch (error) {
      console.error(error);

      toast({
        title: "Error creating channel",
        description: "Something went wrong while creating the channel. Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form className={cn("grid items-start gap-4", className)} onSubmit={form.handleSubmit(onSubmit)}>
        <Alert>
          <SparklesIcon size={16} className="opacity-80" />
          <AlertDescription className="text-xs leading-normal">
            Hashtags (
            <span className="bg-slate-800/70 rounded-md p-1 mx-1">
              <HashIcon size={12} className="inline-block" />
            </span>
            ) will be added automatically, you just need to think of a cool name for your channel!
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 gap-8">
          <FormField
            control={form.control}
            name="channelName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Channel name *</FormLabel>
                <FormControl>
                  <Input placeholder="#questions" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit">Add channel</Button>
      </form>
    </Form>
  );
};

type TChannelItemProps = {
  data: ClassroomChannel;
};

const ChannelItem = ({ data }: TChannelItemProps) => {
  return (
    <Button className="justify-start w-full dark:text-slate-500" variant={"ghost"}>
      <span className="text-sm">{data.name}</span>
    </Button>
  );
};

export function SidebarChannelSection() {
  // zustand state and actions
  const selectedClassroom = useDashboardStore((state) => state.selectedClassroom);

  // state
  const [isOpen, setIsOpen] = useState(false);

  // hooks
  const { data: channels, isLoading } = useClassroomChannels(selectedClassroom?.id);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  return (
    <div>
      <h3 className="flex items-center gap-2 font-light text-lg">
        <HashIcon size={16} />
        Channels
      </h3>

      <ul className="flex flex-col gap-1 mt-2">
        {isLoading && Array.from({ length: 5 }).map((_, i) => <ClassroomChannelSkeleton key={i} />)}

        {!isLoading && !channels.length && (
          <li className="mt-2 text-center text-sm dark:text-slate-500">
            <p>No channels yet</p>
          </li>
        )}

        {!isLoading &&
          channels.map((channel) => (
            <li key={channel.id} className="flex items-center gap-2 mt-2 text-sm">
              <ChannelItem data={channel} />
            </li>
          ))}
      </ul>

      <div className="mt-6">
        {isDesktop ? (
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button
                className="flex flex-col w-full gap-1 py-2 h-auto dark:text-slate-500 hover:dark:text-slate-300 focus:dark:text-slate-300 transition-colors duration-150"
                variant={"outline"}
              >
                <PlusIcon className="shrink-0" size={18} />
                <span className="text-xs">Add Channel</span>
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add channel</DialogTitle>

                <DialogDescription>
                  Channels are where your team communicates. They&apos;re best when organized around a topic —
                  &#35;questions, for example.
                </DialogDescription>
              </DialogHeader>

              <AddChannelForm setIsModalOpen={setIsOpen} />
            </DialogContent>
          </Dialog>
        ) : (
          <Drawer open={isOpen} onOpenChange={setIsOpen}>
            <DrawerTrigger asChild>
              <Button
                className="flex flex-col w-full gap-1 py-2 h-auto dark:text-slate-500 hover:dark:text-slate-300 focus:dark:text-slate-300 transition-colors duration-150"
                variant={"outline"}
              >
                <PlusIcon className="shrink-0" size={18} />
                <span className="text-xs">Add Channel</span>
              </Button>
            </DrawerTrigger>

            <DrawerContent>
              <DrawerHeader className="text-left">
                <DrawerTitle>Add channel</DrawerTitle>

                <DrawerDescription>
                  Channels are where your team communicates. They&apos;re best when organized around a topic —
                  &#35;questions, for example.
                </DrawerDescription>
              </DrawerHeader>

              <AddChannelForm className="p-4" setIsModalOpen={setIsOpen} />

              <DrawerFooter className="pt-2">
                <DrawerClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        )}
      </div>
    </div>
  );
}
