import { BASE_URL } from "."

const BASE_API_ENDPOINT = `${BASE_URL}/api` as const

const API_ENDPOINTS = {
    ORGANIZATION: `${BASE_API_ENDPOINT}/entity/organization`,
    STUDENT: `${BASE_API_ENDPOINT}/entity/student`,
    TEACHER: `${BASE_API_ENDPOINT}/entity/teacher`,
    PROFILE: `${BASE_API_ENDPOINT}/profile`,
} as const

export { API_ENDPOINTS }

