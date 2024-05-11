import { ChatMessages } from "@/components/Chat";
import { MessageInput } from "@/components/Elements";
import { FileState } from "@/components/Elements/dropzone/MultiFileDropzone";
import { useToast } from "@/components/ui/use-toast";
import { useEdgeStore } from "@/config/edgestore";
import { sendMessage } from "@/features/classrooms/api";
import { TFileUploadResponseWithFilename } from "@/features/classrooms/types";
import { useDashboardStore } from "@/stores";
import { sanitizeInput } from "@/utils/misc";
import { FormEvent, RefObject, useState } from "react";

export function ContentPosts() {
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

    if (!selectedClassroom || !selectedChannel) return;

    setIsFormSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);

      const messageContent = formData.get("message") as string;

      if (!fileStates.length && !messageContent) return;

      /* Upload files as temporary files. Backend will confirm them if message is successfully created. */
      let uploadResponses: TFileUploadResponseWithFilename[] = [];
      if (fileStates.length) {
        uploadResponses = await handleFileUpload({ channelId: selectedChannel.id });
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

        <MessageInput
          handleSubmit={handleSendMessage}
          isDisabled={isFormSubmitting}
          fileStates={fileStates}
          setFileStates={setFileStates}
        />
      </div>
    </div>
  );
}
