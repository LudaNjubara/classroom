import { TUserSession } from "@/types/typings";
import { useEffect, useState } from "react";

export const useUserSession = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [userSession, setUserSession] = useState<TUserSession | null>(null);

    useEffect(() => {
        const getSession = async () => {
            setIsLoading(true);
            const session = await fetch("/api/auth");
            const sessionJson = await session.json() as TUserSession;
            setUserSession(sessionJson);
            setIsLoading(false);
        };

        getSession();
    }, []);

    return { isLoading, userSession };
};