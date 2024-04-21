import { MAX_NUM_OF_INVITE_MESSAGE_CHARACTERS } from "@/constants";
import { TStudentSearchBy } from "@/features/students/types";
import { TTeacherSearchBy } from "@/features/teachers";
import { TOrderBy } from "@/types/typings";
import { sanitizeInput } from "./misc";

export function validateSearchBoxInputs(inputs: { query: string, searchByValues: (keyof TTeacherSearchBy)[] | (keyof TStudentSearchBy)[], orderByValue?: TOrderBy }) {
    const { query, searchByValues } = inputs;

    const errors: { query?: string } = {};

    if (searchByValues.length && !query) {
        errors.query = "If you want to search by a specific field, you must provide a query";
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    }
}

export function validateInviteMessageInput(input: string) {
    const errors: { inviteMessage?: string } = {};

    const sanitizedInput = sanitizeInput(input);

    if (!sanitizedInput) {
        errors.inviteMessage = "Message is required";
    }

    if (sanitizedInput.length > MAX_NUM_OF_INVITE_MESSAGE_CHARACTERS) {
        errors.inviteMessage = `Message should not exceed ${MAX_NUM_OF_INVITE_MESSAGE_CHARACTERS} characters`;
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    }
}