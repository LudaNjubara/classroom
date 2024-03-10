
import { TUserSession } from "@/types/typings";
import { useEffect, useState } from "react";
import { fetchUserSession } from "..";

export const useUserSession = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [userSession, setUserSession] = useState<TUserSession | null>(null);

    useEffect(() => {
        const getSession = async () => {
            try {
                setIsLoading(true);
                const userSession = await fetchUserSession();
                setUserSession(userSession);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };

        getSession();
    }, []);

    return { isLoading, userSession };
};