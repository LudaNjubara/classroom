import fetchTeachers from "@/lib/fetchers/fetch-teachers";
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

export function useTeachers(filterParams: TTeachersFetchFilterParams) {
    const [data, setData] = useState<TTeacherWithProfile[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const getTeachers = async () => {
            setIsLoading(true);
            const teachers = await fetchTeachers(filterParams);
            setData(teachers);
            setIsLoading(false);
        };

        getTeachers();
    }, [filterParams]);

    return { data, isLoading };
}