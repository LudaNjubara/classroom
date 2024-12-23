import observableError from "@/services/ErrorObserver";
import { TPaginatedResponse } from "@/types/typings";
import { Role } from "@prisma/client";
import { useEffect, useState } from "react";
import { fetchOrganizationNotifications } from "..";
import { NotificationWithOrgSender, TNotificationForType } from "../types";

const ALLOWED_ROLES: TNotificationForType[] = ["ORGANIZATION", "TEACHER", "STUDENT"];

export function useOrganizationNotifications(profileRole: Role) {
    const [data, setData] = useState<TPaginatedResponse<NotificationWithOrgSender>>({ data: [], count: 0 });
    const [isLoading, setIsLoading] = useState(false);
    const [refetchIndex, setRefetchIndex] = useState(0);

    useEffect(() => {
        const getOrganizationNotifications = async () => {
            try {
                setIsLoading(true);
                const paginatedNotifications = await fetchOrganizationNotifications(profileRole as TNotificationForType);
                setData(paginatedNotifications);

            } catch (error) {
                if (error instanceof Error) {
                    observableError.notify({ title: "Failed to fetch organization notifications", description: error.message });
                }
            } finally {
                setIsLoading(false);
            }
        };

        if (!ALLOWED_ROLES.includes(profileRole as TNotificationForType)) return

        getOrganizationNotifications();
    }, [profileRole, refetchIndex]);

    const refetch = () => {
        setRefetchIndex((prev) => prev + 1);
    }

    return { data, isLoading, refetch };
}