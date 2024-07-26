import { OrganizationSettings } from "@prisma/client";
import { useEffect, useRef, useState } from "react";
import { fetchOrganizationSettings } from "../api/fetch-organization-settings";

export function useOrganizationSettings(organizationId?: string) {
    const [organizationSettings, setOrganizationSettings] = useState<OrganizationSettings[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [refetchIndex, setRefetchIndex] = useState(0);

    let shouldInitializeLoadingRef = useRef(true);

    useEffect(() => {
        if (!organizationId) return;

        const getOrganizationSettings = async () => {
            setIsLoading(shouldInitializeLoadingRef.current);

            const requestData = { organizationId };

            try {
                const { data } = await fetchOrganizationSettings(requestData);

                setOrganizationSettings(data);
            } catch (error) {
                if (error instanceof Error) {
                    setError(error.message);
                }
            } finally {
                setIsLoading(false);
            }
        };

        getOrganizationSettings();
    }, [organizationId, refetchIndex, shouldInitializeLoadingRef]);

    const refetch = () => {
        setRefetchIndex((prev) => prev + 1);
        shouldInitializeLoadingRef.current = false;
    };

    return { data: organizationSettings, isLoading, error, refetch };
}

