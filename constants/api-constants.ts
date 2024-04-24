import { BASE_URL } from "./app-constants"

const BASE_API_ENDPOINT = `${BASE_URL}/api` as const

export const API_ENDPOINTS = {
    ORGANIZATION: `${BASE_API_ENDPOINT}/entity/organization`,
    STUDENT: `${BASE_API_ENDPOINT}/entity/student`,
    TEACHER: `${BASE_API_ENDPOINT}/entity/teacher`,
    NOTIFICATION: {
        DISMISS: `${BASE_API_ENDPOINT}/entity/notification/dismiss`,
        ACCEPT: {
            ORGANIZATION: `${BASE_API_ENDPOINT}/entity/notification/accept/organization`,
            TEACHER: `${BASE_API_ENDPOINT}/entity/notification/accept/teacher`,
            STUDENT: `${BASE_API_ENDPOINT}/entity/notification/accept/student`,
        },
        INVITE_TEACHERS: `${BASE_API_ENDPOINT}/entity/notification/invite-teachers`,
        INVITE_STUDENTS: `${BASE_API_ENDPOINT}/entity/notification/invite-students`,
        ORGANIZATION: {
            TEACHER: `${BASE_API_ENDPOINT}/entity/notification/organization/for-teacher`,
            STUDENT: `${BASE_API_ENDPOINT}/entity/notification/organization/for-student`,
            ORGANIZATION: `${BASE_API_ENDPOINT}/entity/notification/organization/for-organization`,
        },
    },
    PROFILE: `${BASE_API_ENDPOINT}/profile`,
    AUTH: `${BASE_API_ENDPOINT}/auth`,
} as const