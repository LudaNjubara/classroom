const ERROR_MESSAGES = {
    DEFAULT: {
        TITLE: "Unknown error",
        DESCRIPTION: "Something went wrong. Please try again later."
    },
    CLIENT_ERROR: {
        BAD_REQUEST: {
            CODE: 400,
            TITLE: "Bad Request",
            DESCRIPTION: "The request could not be understood by the server due to malformed syntax."
        },
        UNAUTHORIZED: {
            CODE: 401,
            TITLE: "Unauthorized",
            DESCRIPTION: "You are not authorized to access the requested resource."
        },
        FORBIDDEN: {
            CODE: 403,
            TITLE: "Forbidden",
            DESCRIPTION: "You are not authorized to perform current action."
        },
        NOT_FOUND: {
            CODE: 404,
            TITLE: "Not Found",
            DESCRIPTION: "The requested resource could not be found."
        },
        METHOD_NOT_ALLOWED: {
            CODE: 405,
            TITLE: "Method Not Allowed",
            DESCRIPTION: "The method specified in the request is not allowed for the resource identified by the request URI."
        },
        TOO_MANY_REQUESTS: {
            CODE: 429,
            TITLE: "Too Many Requests",
            DESCRIPTION: "Too many requests have been received recently. Please try again later."
        }
    },
    SERVER_ERROR: {
        INTERNAL_SERVER_ERROR: {
            CODE: 500,
            TITLE: "Internal Server Error",
            DESCRIPTION: "The server encountered an unexpected condition that prevented it from fulfilling the request."
        },
        BAD_GATEWAY: {
            CODE: 502,
            TITLE: "Bad Gateway",
            DESCRIPTION: "The server, while acting as a gateway or proxy, received an invalid response from an inbound server it accessed while attempting to fulfill the request."
        },
        SERVICE_UNAVAILABLE: {
            CODE: 503,
            TITLE: "Service Unavailable",
            DESCRIPTION: "The server is currently unable to handle the request due to a temporary overload or scheduled maintenance, which will likely be alleviated after some delay."
        },
        GATEWAY_TIMEOUT: {
            CODE: 504,
            TITLE: "Gateway Timeout",
            DESCRIPTION: "The server, while acting as a gateway or proxy, did not receive a timely response from an upstream server it needed to access in order to complete the request."
        }
    }
} as const;

export { ERROR_MESSAGES };

