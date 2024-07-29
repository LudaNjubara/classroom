import { BASE_URL } from "./app-constants"

const BASE_API_ENDPOINT = `${BASE_URL}/api` as const

export const API_ENDPOINTS = {
    ORGANIZATION: {
        GET: `${BASE_API_ENDPOINT}/entity/organization`,
        CREATE: `${BASE_API_ENDPOINT}/entity/organization`,
        SETTINGS: {
            GET: `${BASE_API_ENDPOINT}/entity/organization/settings`,
            UPDATE: `${BASE_API_ENDPOINT}/entity/organization/settings`,
        }
    },
    STUDENT: `${BASE_API_ENDPOINT}/entity/student`,
    TEACHER: `${BASE_API_ENDPOINT}/entity/teacher`,
    MESSAGES: {
        CREATE: `${BASE_API_ENDPOINT}/socket/messages`,
        GET: `${BASE_API_ENDPOINT}/entity/message`,
        UPDATE: `${BASE_API_ENDPOINT}/socket/messages`,
        DELETE: `${BASE_API_ENDPOINT}/socket/messages`,
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
    COMMUNITY: {
        ARTICLE: {
            CREATE: `${BASE_API_ENDPOINT}/entity/community/article`,
            GET_ALL: `${BASE_API_ENDPOINT}/entity/community/article/get-all`,
        }
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
        ASSIGNMENT: {
            CREATE: `${BASE_API_ENDPOINT}/entity/classroom/assignment`,
            GET_ALL: `${BASE_API_ENDPOINT}/entity/classroom/assignment/get-all`,
            UPDATE: `${BASE_API_ENDPOINT}/entity/classroom/assignment`,
            REMOVE: `${BASE_API_ENDPOINT}/entity/classroom/assignment/remove`,
            RESOURCE: {
                GET_ALL_FOR_ASSIGNMENT: `${BASE_API_ENDPOINT}/entity/classroom/assignment/resource/get-all-for-assignment`,
            }
        },
        ASSIGNMENT_SOLUTION: {
            CREATE: `${BASE_API_ENDPOINT}/entity/classroom/assignment-solution`,
            GRADE: `${BASE_API_ENDPOINT}/entity/classroom/assignment-solution/grade`,
            GET_ALL: `${BASE_API_ENDPOINT}/entity/classroom/assignment-solution/get-all`,
            GET_LAST_UPLOADED: `${BASE_API_ENDPOINT}/entity/classroom/assignment-solution/last-uploaded`,
            FILE: {
                GET_ALL: `${BASE_API_ENDPOINT}/entity/classroom/assignment-solution/file/get-all`,
            },
        },
        RESOURCE: {
            GET_ALL: `${BASE_API_ENDPOINT}/entity/classroom/resource/get-all`,
        },
        TEACHER: {
            GET_ALL: `${BASE_API_ENDPOINT}/entity/classroom/teacher/get-all`,
            REMOVE: `${BASE_API_ENDPOINT}/entity/classroom/teacher/remove`,
        },
        STUDENT: {
            GET_ALL: `${BASE_API_ENDPOINT}/entity/classroom/student/get-all`,
            REMOVE: `${BASE_API_ENDPOINT}/entity/classroom/student/remove`,
        },
    },
    CALL: {
        GENERATE_TOKEN: `${BASE_API_ENDPOINT}/entity/call/generate-client-token`,
    },
    STATISTICS: {
        GET: `${BASE_API_ENDPOINT}/entity/statistics`,
        SEND: `${BASE_API_ENDPOINT}/entity/statistics`,
        GENERATE_SUMMARY: `${BASE_API_ENDPOINT}/entity/statistics/generate-summary`,
        GET_SUMMARY: `${BASE_API_ENDPOINT}/entity/statistics/get-summary`,
    },
    PROFILE: `${BASE_API_ENDPOINT}/profile`,
    AUTH: `${BASE_API_ENDPOINT}/auth`,
} as const

export const HTTP_STATUS_CODES = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    UNPROCESSABLE_CONTENT: 422,
    INTERNAL_SERVER_ERROR: 500,
} as const