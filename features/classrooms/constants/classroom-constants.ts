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