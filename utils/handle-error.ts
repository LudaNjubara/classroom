import { ERROR_MESSAGES } from "@/constants";

const handleError = (statusCode: number) => {

    switch (statusCode) {
        case 400:
            throw new Error(ERROR_MESSAGES.CLIENT_ERROR.BAD_REQUEST.TITLE);
        case 401:
            throw new Error(ERROR_MESSAGES.CLIENT_ERROR.UNAUTHORIZED.TITLE);
        case 403:
            throw new Error(ERROR_MESSAGES.CLIENT_ERROR.FORBIDDEN.TITLE);
        case 404:
            throw new Error(ERROR_MESSAGES.CLIENT_ERROR.NOT_FOUND.TITLE);
        case 405:
            throw new Error(ERROR_MESSAGES.CLIENT_ERROR.METHOD_NOT_ALLOWED.TITLE);
        case 429:
            throw new Error(ERROR_MESSAGES.CLIENT_ERROR.TOO_MANY_REQUESTS.TITLE);
        case 500:
            throw new Error(ERROR_MESSAGES.SERVER_ERROR.INTERNAL_SERVER_ERROR.TITLE);
        case 502:
            throw new Error(ERROR_MESSAGES.SERVER_ERROR.BAD_GATEWAY.TITLE);
        case 503:
            throw new Error(ERROR_MESSAGES.SERVER_ERROR.SERVICE_UNAVAILABLE.TITLE);
        case 504:
            throw new Error(ERROR_MESSAGES.SERVER_ERROR.GATEWAY_TIMEOUT.TITLE);
        default:
            throw new Error(ERROR_MESSAGES.DEFAULT.TITLE);
    }
}

export { handleError };

