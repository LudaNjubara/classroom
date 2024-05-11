import observableError from "@/services/ErrorObserver";
import { useEffect, useState } from "react";
import { fetchChannelResources } from "../api/fetch-channel-resources";
import { TResourceWithMetadata } from "../types";

export function useChannelResources(channelId?: string) {
    const [resources, setResources] = useState<TResourceWithMetadata[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [refetchIndex, setRefetchIndex] = useState(0);

    useEffect(() => {
        if (!channelId) return;

        const getChannelResources = async () => {
            setIsLoading(true);

            const requestData = { channelId };

            try {
                const { data } = await fetchChannelResources(requestData);

                setResources(data);
            } catch (error) {
                if (error instanceof Error) {
                    observableError.notify({ title: "Failed to fetch channel resources", description: error.message });
                }
            } finally {
                setIsLoading(false);
            }
        };

        getChannelResources();
    }, [channelId, refetchIndex]);

    const refetch = () => setRefetchIndex((prev) => prev + 1);

    return { data: resources, isLoading, refetch };
}

