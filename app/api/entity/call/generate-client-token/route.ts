
import { db } from "@/config";
import { STREAMIO_API_KEY, STREAMIO_API_SECRET_KEY } from "@/constants";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { StreamChat } from "stream-chat";

const generateClientToken = (profileId: string, apiKey: string, apiSecretKey: string) => {
    const serverClient = StreamChat.getInstance(apiKey, apiSecretKey);
    const token = serverClient.createToken(profileId);

    return token;
};

export async function GET(req: NextRequest) {
    try {
        const { isAuthenticated, getUser } = getKindeServerSession();

        if (!await isAuthenticated()) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const user = await getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const profile = await db.profile.findUnique({
            where: {
                kindeId: user.id,
            },
        });

        if (!profile) {
            return NextResponse.json({ error: "Profile not found" }, { status: 404 })
        }

        const apiKey = STREAMIO_API_KEY;
        const secretApiKey = STREAMIO_API_SECRET_KEY;

        if (!apiKey || !secretApiKey) {
            return NextResponse.json({ error: "Internal server error" }, { status: 500 });
        }

        const token = generateClientToken(profile.id, apiKey, secretApiKey);

        return NextResponse.json({ token }, { status: 200 });
    } catch (error) {
        console.log(error)

        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}