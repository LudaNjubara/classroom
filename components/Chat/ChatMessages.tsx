import { useDashboardContext } from "@/context";
import { useChatQuery } from "@/features/classrooms/hooks/useChatQuery";
import { TMessageWithSender } from "@/features/classrooms/types";
import { useDashboardStore } from "@/stores";
import { Spinner } from "@components/Loaders";
import { ServerCrashIcon } from "lucide-react";
import { memo } from "react";
import { Button } from "../ui/button";
import { Message } from "./Message";

type TChatMessagesProps = {
  channelId: string;
};

export const ChatMessages = memo(({ channelId }: TChatMessagesProps) => {
  // context
  const { profile } = useDashboardContext();

  // zustand state and actions
  const selectedClassroom = useDashboardStore((state) => state.selectedClassroom);
  const accentColors = useDashboardStore((state) => state.accentColors);

  // derived state
  const queryKey = `chat:${channelId}`;

  // hooks
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status, refetch } = useChatQuery({
    queryKey,
    channelId,
  });

  if (status === "pending") {
    return (
      <div className="flex flex-col gap-4 pb-16 flex-1 justify-center items-center">
        <Spinner />

        <p className="text-sm dark:text-slate-700 text-slate-500">Loading messages...</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex flex-col gap-4 pb-16 flex-1 justify-center items-center">
        <ServerCrashIcon size={30} className="opacity-80" />

        <p className="text-sm dark:text-slate-700 text-slate-500">Something went wrong...</p>

        <Button variant="outline" onClick={() => refetch()} className="text-sm">
          Try again
        </Button>
      </div>
    );
  }

  return (
    <div className="max-h-[390px] overflow-y-auto flex flex-col gap-4 flex-1 pb-16 pr-2">
      {data?.pages.map((page, index) => {
        return (
          <div key={index} className="flex flex-col gap-2">
            {page.messages.map((message: TMessageWithSender) => (
              <Message
                key={message.id}
                data={message}
                accentColor={accentColors[selectedClassroom!.id]}
                isCurrentUser={message.senderData.profileId === profile.kindeId}
              />
            ))}
          </div>
        );
      })}

      {hasNextPage && (
        <div className="flex justify-center">
          <button
            className="bg-slate-900/50 hover:bg-slate-900/70 text-sm text-slate-200 px-4 py-2 rounded-lg"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage ? <Spinner /> : "Load more"}
          </button>
        </div>
      )}
    </div>
  );
});

ChatMessages.displayName = "ChatMessages";
