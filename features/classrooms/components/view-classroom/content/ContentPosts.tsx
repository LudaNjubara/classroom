import { MessageInput } from "@/components/Elements";
import { useToast } from "@/components/ui/use-toast";
import { sendMessage } from "@/features/classrooms/api";
import { useDashboardStore } from "@/stores";
import { sanitizeInput } from "@/utils/misc";
import { FormEvent, useState } from "react";

export function ContentPosts() {
  // zustand state and actions
  const selectedClassroom = useDashboardStore((state) => state.selectedClassroom);
  const selectedChannel = useDashboardStore((state) => state.selectedChannel);

  // state
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);

  // hooks
  const { toast } = useToast();

  // handlers
  const handleSendMessage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedClassroom || !selectedChannel) return;

    setIsFormSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);

      const messageContent = formData.get("message") as string;

      const messageData = await sendMessage({
        message: {
          content: sanitizeInput(messageContent),
        },
        query: {
          classroomId: selectedClassroom.id,
          channelId: selectedChannel.id,
        },
      });

      console.log(messageData);
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

  return (
    <div className="flex flex-col gap-5">
      {/* Content */}
      <div className="flex-1 bg-red-500"></div>

      {/* Input for creating a message */}
      <div className="">
        <MessageInput handleSubmit={handleSendMessage} isDisabled={isFormSubmitting} />
      </div>
    </div>
  );
}
