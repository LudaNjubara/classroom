import { backendClient } from "@/lib/edgestore-server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const { isAuthenticated, getUser } = getKindeServerSession();

    if (!await isAuthenticated()) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await getUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url);
    const resourceUrl = searchParams.get("url");

    if (!resourceUrl) {
        return NextResponse.json({ error: "Invalid query parameter 'url'" }, { status: 400 });
    }

    const resource = await backendClient.publicFiles.getFile({
        url: resourceUrl,
    })

    return NextResponse.json({ data: resource }, { status: 200 });
}