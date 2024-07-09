import { useDashboardContext } from "@/context";
import { useChatQuery } from "@/features/classrooms/hooks/useChatQuery";
import { useChatScroll } from "@/features/classrooms/hooks/useChatScroll";
import { useChatSocket } from "@/features/classrooms/hooks/useChatSocket";
import { TMessageWithSender } from "@/features/classrooms/types";
import { useDashboardStore } from "@/stores";
import { Spinner } from "@components/Loaders";
import { ServerCrashIcon } from "lucide-react";
import { Fragment, memo, useRef } from "react";
import { Button } from "../ui/button";
import { ChatWelcome } from "./ChatWelcome";
import { Message } from "./Message";

type TChatMessagesProps = {
  channelId: string;
};

export const ChatMessages = memo(({ channelId }: TChatMessagesProps) => {
  // context
  const { profile } = useDashboardContext();

  // zustand state and actions
  const selectedClassroom = useDashboardStore((state) => state.selectedClassroom);
  const selectedChannel = useDashboardStore((state) => state.selectedChannel);
  const accentColors = useDashboardStore((state) => state.accentColors);

  // state
  const chatRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // derived state
  const addKey = `chat:${channelId}:add-message`;
  const updateKey = `chat:${channelId}:update-message`;
  const queryKey = `chat:${channelId}:messages`;

  // hooks
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status, refetch } = useChatQuery({
    queryKey,
    channelId,
  });

  useChatSocket({
    addKey,
    updateKey,
    queryKey,
  });

  useChatScroll({
    shouldLoadMore: !isFetchingNextPage && !!hasNextPage,
    chatRef: chatRef,
    bottomRef: bottomRef,
    loadMore: fetchNextPage,
    count: data?.pages?.[0]?.messages?.length || 0,
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
    <div ref={chatRef} className="max-h-[420px] overflow-y-auto flex flex-col gap-4 flex-1 pb-16 pr-2">
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

      {selectedChannel && !hasNextPage && <ChatWelcome channelName={selectedChannel.name} />}

      <div className="flex flex-col-reverse gap-2">
        {data?.pages?.map((page, i) => (
          <Fragment key={i}>
            {page.messages.map((message: TMessageWithSender) => (
              <Message
                key={message.id}
                data={message}
                accentColor={accentColors[selectedClassroom!.id]}
                isCurrentUser={message.senderData.profileId === profile.kindeId}
                channelId={selectedChannel!.id}
              />
            ))}
          </Fragment>
        ))}
      </div>

      <div ref={bottomRef} />
    </div>
  );
});

ChatMessages.displayName = "ChatMessages";
