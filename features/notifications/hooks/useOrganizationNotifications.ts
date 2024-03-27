import observableError from "@/services/ErrorObserver";
import { TPaginatedResponse } from "@/types/typings";
import { Notification } from "@prisma/client";
import { useEffect, useState } from "react";
import { fetchOrganizationNotifications } from "..";

export function useOrganizationNotifications() {
    const [data, setData] = useState<TPaginatedResponse<Notification>>({ data: [], count: 0 });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const getOrganizationNotifications = async () => {
            try {
                setIsLoading(true);
                const paginatedNotifications = await fetchOrganizationNotifications();
                setData(paginatedNotifications);

            } catch (error) {
                if (error instanceof Error) {
                    observableError.notify({ title: "Failed to fetch organization notifications", description: error.message });
                }
            } finally {
                setIsLoading(false);
            }
        };

        getOrganizationNotifications();
    }, []);

    return { data, isLoading };
}