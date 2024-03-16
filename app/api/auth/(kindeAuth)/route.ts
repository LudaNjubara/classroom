import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
    const { getUser, getPermissions, getOrganization, isAuthenticated } = getKindeServerSession();

    const userSession = {
        isAuthenticated: await isAuthenticated(),
        user: await getUser(),
        permissions: await getPermissions(),
        organization: await getOrganization(),
    };

    return NextResponse.json(userSession);
}