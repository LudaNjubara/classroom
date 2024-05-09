import { useSocket } from "@/providers/socket-provider";
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchMessages } from "../api/fetch-messages";

const DEFAULT_FETCH_INTERVAL = 2000;

type TUseChatQueryProps = {
    queryKey: string;
    channelId: string;
};

export const useChatQuery = ({ queryKey, channelId }: TUseChatQueryProps) => {
    const { isConnected } = useSocket();

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status,
        refetch
    } = useInfiniteQuery({
        queryKey: [queryKey],
        queryFn: ({ pageParam }) => fetchMessages({ channelId, pageParam }),
        initialPageParam: undefined,
        getNextPageParam: (lastPage) => lastPage?.nextCursor,
        refetchInterval: isConnected ? false : DEFAULT_FETCH_INTERVAL,
    });

    return {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status,
        refetch
    };
};