import { db } from "@/config";
import { MAX_ASSIGNMENT_SOLUTION_GRADE, MIN_ASSIGNMENT_SOLUTION_GRADE } from "@/constants";
import { TGradeClassroomAssignmentSolutionRequestBody } from "@/features/classrooms/types";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { Role } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

type TAllowedRoles = Exclude<Role, "ADMIN" | "GUEST" | "ORGANIZATION" | "STUDENT">;

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

        const { solutionAssesment }: { solutionAssesment: TGradeClassroomAssignmentSolutionRequestBody } = await req.json();
        const { solutionId, grade } = solutionAssesment;

        if (
            !solutionId
            || grade === undefined
            || grade === null
            || grade < MIN_ASSIGNMENT_SOLUTION_GRADE
            || grade > MAX_ASSIGNMENT_SOLUTION_GRADE
        ) {
            return NextResponse.json({ error: "Invalid request" }, { status: 400 })
        }

        const oldSolution = await db.assignmentSolution.findUnique({
            where: {
                id: solutionId
            }
        });

        if (!oldSolution) {
            return NextResponse.json({ error: "Solution not found" }, { status: 404 })
        }

        if (oldSolution.status === "LOCKED") {
            return NextResponse.json({ error: "Solution already graded" }, { status: 400 })
        } else if (oldSolution.status === "RETURNED") {
            return NextResponse.json({ error: "Solution returned for student revision. Please wait for a resubmission of the solution." }, { status: 400 })
        }

        const solution = await db.assignmentSolution.update({
            where: {
                id: solutionId
            },
            data: {
                grade,
                status: "LOCKED"
            }
        });

        return NextResponse.json({ message: "Solution successfuly graded", data: solution }, { status: 200 });

    } catch (error) {
        console.log("error", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }

}