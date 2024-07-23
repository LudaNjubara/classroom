import { client, db } from "@/config";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { Role } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const MODEL = "gpt-3.5-turbo";
const MESSAGE_ROLE = "system";
const MAX_TOKENS = 150;
const TEMPERATURE = 0.4;
const NUM_OF_MESSAGES = 1;
const RESPONSE_FORMAT_TYPE = "text";

type TAllowedRoles = Exclude<Role, "ADMIN" | "STUDENT" | "GUEST" | "ORGANIZATION">;

export async function POST(req: NextRequest) {
    try {
        const { isAuthenticated, getUser } = getKindeServerSession();

        if (!await isAuthenticated()) {
            return NextResponse.json("Unauthorized", { status: 401 });
        }

        const user = await getUser();

        if (!user) {
            return NextResponse.json("Unauthorized", { status: 401 });
        }

        const profile = await db.profile.findUnique({
            where: {
                kindeId: user.id
            }
        });

        if (!profile) {
            return NextResponse.json({ error: "Profile not found" }, { status: 404 })
        }

        const allowedRoles: TAllowedRoles[] = ["TEACHER"];

        if (!allowedRoles.includes(profile.role as TAllowedRoles)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { prompt, classroomId }: {
            prompt: string;
            classroomId: string;
        } = await req.json();

        if (!prompt) {
            return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
        }

        const chatCompletion = await client.chat.completions.create({
            model: MODEL,
            messages: [
                {
                    role: MESSAGE_ROLE,
                    content: prompt,
                }
            ],
            max_tokens: MAX_TOKENS,
            temperature: TEMPERATURE,
            n: NUM_OF_MESSAGES,
            response_format: {
                type: RESPONSE_FORMAT_TYPE
            },
            user: user.id,
        });

        if (chatCompletion.choices.length === 0) {
            console.log("No completion generated", chatCompletion.choices)
            return NextResponse.json({ error: "Failed to generate summary" }, { status: 500 })
        } else if (chatCompletion.choices[0].finish_reason === "length") {
            console.log("Length limit reached", chatCompletion.choices[0].message.content)
            return NextResponse.json({ error: "Failed to generate summary" }, { status: 500 })
        } else if (chatCompletion.choices[0].finish_reason === "content_filter") {
            console.log("Content filter triggered", chatCompletion.choices[0].message.content)
            return NextResponse.json({ error: "Failed to generate summary" }, { status: 500 })
        }

        const summary = chatCompletion.choices[0].message.content;

        if (!summary) {
            console.log("No summary generated", summary)
            return NextResponse.json({ error: "Failed to generate summary" }, { status: 500 })
        }

        const insightSummary = await db.statisticsSummary.create({
            data: {
                prompt,
                content: summary,
                classroom: {
                    connect: {
                        id: classroomId
                    }
                }
            },
        })

        if (!insightSummary) {
            return NextResponse.json({ error: "Failed to generate summary" }, { status: 500 })
        }

        return NextResponse.json({ insightSummary }, { status: 200 })
    }

    catch (error) {
        console.log("error", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}