import { ChatMessages } from "@/components/Chat";
import { MessageInput } from "@/components/Elements";
import { useToast } from "@/components/ui/use-toast";
import { sendMessage } from "@/features/classrooms/api";
import { useDashboardStore } from "@/stores";
import { sanitizeInput } from "@/utils/misc";
import { FormEvent, RefObject, useState } from "react";

export function ContentPosts() {
  // zustand state and actions
  const selectedClassroom = useDashboardStore((state) => state.selectedClassroom);
  const selectedChannel = useDashboardStore((state) => state.selectedChannel);

  // state
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);

  // hooks
  const { toast } = useToast();

  // handlers
  const handleSendMessage = async (e: FormEvent<HTMLFormElement>, inputRef: RefObject<HTMLInputElement>) => {
    e.preventDefault();

    if (!selectedClassroom || !selectedChannel) return;

    setIsFormSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);

      const messageContent = formData.get("message") as string;

      if (!messageContent) return;

      const messageData = await sendMessage({
        message: {
          content: sanitizeInput(messageContent),
        },
        query: {
          classroomId: selectedClassroom.id,
          channelId: selectedChannel.id,
        },
      });

      if (messageData && inputRef.current) {
        console.log("Message sent successfully");
        inputRef.current.value = "";
        inputRef.current.focus();
      }
    } catch (error) {
      console.log("Error sending message", error);

      toast({
        title: "Error sending message",
        description: "An error occurred while sending your message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsFormSubmitting(false);
    }
  };

  if (!selectedChannel)
    return (
      <div>
        <p className="text-base font-semibold text-slate-700">Select a channel to view posts</p>
      </div>
    );

  return (
    <div className="flex flex-col gap-5">
      <div className="relative flex-1">
        <ChatMessages channelId={selectedChannel.id} />

        <MessageInput handleSubmit={handleSendMessage} isDisabled={isFormSubmitting} />
      </div>
    </div>
  );
}
