import { Role } from "@prisma/client";

export const CLASSROOM_ACCENT_COLORS = [
    {
        value: "#F87171",
        label: "Red",
    },
    {
        value: "#FBBF24",
        label: "Yellow",
    },
    {
        value: "#34D399",
        label: "Green",
    },
    {
        value: "#60A5FA",
        label: "Blue",
    },
    {
        value: "#818CF8",
        label: "Indigo",
    },
    {
        value: "#F472B6",
        label: "Pink",
    },
    {
        value: "#D97706",
        label: "Orange",
    },
] as const;

export const ALLOWED_ROLES_TO_SEND_MESSAGES: Role[] = ["STUDENT", "TEACHER"] as const;

export const INSIGHTS_SUMMARY_MARKDOWN_OPTIONS = {
    overrides: {
        h1: {
            props: {
                className: "mb-3 text-2xl font-semibold",
            },
        },
        h2: {
            props: {
                className: "mt-4 mb-1 text-lg font-semibold underline underline-offset-2",
            },
        },
        ul: {
            props: {
                className: "pl-5 my-2 border-l-4 list-inside",
            },
        },
        li: {
            props: {
                className: "py-2",
            },
        },
        p: {
            props: {
                className: "pl-5",
            },
        },
    },
}