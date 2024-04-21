import { Role } from "@prisma/client";

export type TNotificationAction = "ACCEPT" | "DISMISS";
export type TNotificationForType = Exclude<Role, "ADMIN" | "GUEST">