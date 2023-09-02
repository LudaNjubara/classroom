import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
    const { getUser, getPermissions, getOrganization, isAuthenticated } = getKindeServerSession();

    const userSession = {
        isAuthenticated: isAuthenticated(),
        user: getUser(),
        permissions: getPermissions(),
        organization: getOrganization(),
    };

    return NextResponse.json(userSession);
}