import { TUserSession } from "@/types/typings";
import { API_ENDPOINTS } from "../../../constants/api-constants";

export const fetchUserSession = async (): Promise<TUserSession | null> => {

    const response = await fetch(API_ENDPOINTS.AUTH);

    if (!response.ok) {
        throw new Error("There was an error fetching the user session");
    }

    const userSession = await response.json();

    return userSession;
};