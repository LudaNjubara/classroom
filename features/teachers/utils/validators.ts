import { TOrderBy, TTeacherSearchBy } from "@/types/typings";

export function validateSearchBoxInputs(inputs: { query: string, searchByValues: (keyof TTeacherSearchBy)[], orderByValue?: TOrderBy }) {
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