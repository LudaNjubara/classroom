import { ChatMessages } from "@/components/Chat";
import { MessageInput } from "@/components/Elements";
import { FileState } from "@/components/Elements/dropzone/MultiFileDropzone";
import { useToast } from "@/components/ui/use-toast";
import { useEdgeStore } from "@/config/edgestore";
import { useDashboardContext } from "@/context";
import { sendMessage, updateClassroom } from "@/features/classrooms/api";
import { ALLOWED_ROLES_TO_SEND_MESSAGES } from "@/features/classrooms/constants";
import { TFileUploadResponseWithFilename } from "@/features/classrooms/types";
import { useStatistics } from "@/providers/statistics-provider";
import { useDashboardStore } from "@/stores";
import { ECommunicationStatisticsEvent } from "@/types/enums";
import { sanitizeInput } from "@/utils/misc";
import Image from "next/image";
import { FormEvent, RefObject, useState } from "react";

export function ContentPosts() {
  // context
  const { profile } = useDashboardContext();
  const { trackEvent } = useStatistics();

  // zustand state and actions
  const selectedClassroom = useDashboardStore((state) => state.selectedClassroom);
  const selectedChannel = useDashboardStore((state) => state.selectedChannel);

  // state
  const [fileStates, setFileStates] = useState<FileState[]>([]);
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);

  // hooks
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

  const handleFileUpload = async ({ channelId }: { channelId: string }) => {
    const uploadResponses: TFileUploadResponseWithFilename[] = [];

    await Promise.all(
      fileStates.map(async (fileState) => {
        try {
          if (fileState.progress !== "PENDING") return;
          const res = await edgestore.publicFiles.upload({
            input: {
              classroomId: selectedClassroom?.id,
              channelId,
            },
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

  const handleSendMessage = async (e: FormEvent<HTMLFormElement>, inputRef: RefObject<HTMLInputElement>) => {
    e.preventDefault();

    if (!selectedClassroom || !selectedChannel || (profile.role !== "STUDENT" && profile.role !== "TEACHER"))
      return;

    const formData = new FormData(e.currentTarget);
    const messageContent = formData.get("message") as string;

    if (!fileStates.length && !messageContent) return;

    try {
      setIsFormSubmitting(true);

      /* Upload files as temporary files. Backend will confirm them if message is successfully created. */
      let uploadResponses: TFileUploadResponseWithFilename[] = [];
      if (fileStates.length) {
        uploadResponses = await handleFileUpload({ channelId: selectedChannel.id });

        await updateClassroom({
          resources: uploadResponses,
        });
      }

      /* Create the message and confirm uploaded files */
      const messageData = await sendMessage({
        message: {
          content: sanitizeInput(messageContent),
          fileUrl: uploadResponses[0]?.url,
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

        // track statistics
        trackEvent(
          ECommunicationStatisticsEvent.TOTAL_NUMBER_OF_MESSAGES,
          { classroomId: selectedClassroom.id },
          { count: 1 }
        );
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
      <div className="flex flex-col items-center justify-center gap-5 py-8 tracking-wide">
        <Image src="/no-channels.svg" alt="No channels" width={230} height={230} className="opacity-70" />
        <p className="text-slate-500 text-lg font-semibold">
          No channels yet. Create them to view their posts
        </p>
      </div>
    );

  return (
    <div className="flex flex-col gap-5">
      <div className="relative flex-1">
        <ChatMessages channelId={selectedChannel.id} />

        <MessageInput
          handleSubmit={handleSendMessage}
          isDisabled={!ALLOWED_ROLES_TO_SEND_MESSAGES.includes(profile.role)}
          isSubmitting={isFormSubmitting}
          fileStates={fileStates}
          setFileStates={setFileStates}
        />
      </div>
    </div>
  );
}
