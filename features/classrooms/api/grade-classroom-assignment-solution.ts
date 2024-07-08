"use server"

import { API_ENDPOINTS } from "@/constants";
import { cookies } from "next/headers";

type TGradeClassroomAssignmentSolutionProps = {
    solutionId: string;
    grade: number;
};

export async function gradeClassroomAssignmentSolution(
    solutionAssesment
        : TGradeClassroomAssignmentSolutionProps) {
    const response = await fetch(API_ENDPOINTS.CLASSROOM.ASSIGNMENT_SOLUTION.GRADE, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Cookie: cookies().toString(),
        },
        body: JSON.stringify({ solutionAssesment }),
    });

    if (!response.ok) {
        const res = await response.json();

        throw new Error(res.error)
    }

    return response.json();
};