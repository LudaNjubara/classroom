import fetchTeachers from "@/lib/fetchers/fetch-teachers";
import observableError from "@/services/ErrorObserver";
import { TTeacherWithProfile, TTeachersFetchFilterParams, TUserSession } from "@/types/typings";
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

export function useTeachers(filterParams: TTeachersFetchFilterParams | undefined) {
    const [data, setData] = useState<TTeacherWithProfile[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const getTeachers = async () => {
            try {
                setIsLoading(true);
                const teachers = await fetchTeachers(filterParams);
                setData(teachers);

            } catch (error) {
                if (error instanceof Error) {
                    observableError.notify({ title: "Failed to fetch teachers", description: error.message });
                }
            } finally {
                setIsLoading(false);
            }
        };

        getTeachers();
    }, [filterParams]);

    console.log("data", data)

    return { data, isLoading };
}