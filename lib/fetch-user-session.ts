import { TUserSession } from "@/types/typings";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

const fetchUserSession = (): TUserSession => {
    const { getUser, getPermissions, getOrganization, isAuthenticated } = getKindeServerSession();

    const userSession: TUserSession = {
        isAuthenticated: isAuthenticated(),
        user: getUser(),
        permissions: getPermissions(),
        organization: getOrganization(),
    };

    return userSession;
};

export default fetchUserSession;