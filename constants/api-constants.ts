import { BASE_URL } from "./app-constants"

const BASE_API_ENDPOINT = `${BASE_URL}/api` as const

export const API_ENDPOINTS = {
    ORGANIZATION: `${BASE_API_ENDPOINT}/entity/organization`,
    STUDENT: `${BASE_API_ENDPOINT}/entity/student`,
    TEACHER: `${BASE_API_ENDPOINT}/entity/teacher`,
    NOTIFICATION: {
        INVITE_TEACHERS: `${BASE_API_ENDPOINT}/entity/notification/invite-teachers`,
        ORGANIZATION: `${BASE_API_ENDPOINT}/entity/notification/organization`,
    },
    PROFILE: `${BASE_API_ENDPOINT}/profile`,
    AUTH: `${BASE_API_ENDPOINT}/auth`,
} as const

