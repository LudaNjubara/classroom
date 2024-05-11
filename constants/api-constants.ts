import { BASE_URL } from "./app-constants"

const BASE_API_ENDPOINT = `${BASE_URL}/api` as const

export const API_ENDPOINTS = {
    ORGANIZATION: `${BASE_API_ENDPOINT}/entity/organization`,
    STUDENT: `${BASE_API_ENDPOINT}/entity/student`,
    TEACHER: `${BASE_API_ENDPOINT}/entity/teacher`,
    MESSAGES: {
        CREATE: `${BASE_API_ENDPOINT}/socket/messages`,
        GET: `${BASE_API_ENDPOINT}/entity/message`,
    },
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
    RESOURCE: {
        GET_ONE: `${BASE_API_ENDPOINT}/entity/resource`,
    },
    CLASSROOM: {
        CREATE: `${BASE_API_ENDPOINT}/entity/classroom`,
        UPDATE: `${BASE_API_ENDPOINT}/entity/classroom`,
        GET_ALL: `${BASE_API_ENDPOINT}/entity/classroom/get-all`,
        CHANNEL: {
            GET_ALL: `${BASE_API_ENDPOINT}/entity/classroom/channel/get-all`,
            RESOURCE: {
                GET_ALL: `${BASE_API_ENDPOINT}/entity/classroom/channel/resource/get-all`,
            },
        },
        RESOURCE: {
            GET_ALL: `${BASE_API_ENDPOINT}/entity/classroom/resource/get-all`,
        },
    },
    PROFILE: `${BASE_API_ENDPOINT}/profile`,
    AUTH: `${BASE_API_ENDPOINT}/auth`,
} as const