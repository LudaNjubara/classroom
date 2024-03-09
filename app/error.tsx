"use client";

import { ERROR_MESSAGES } from "@/lib/constants/error-constants";
import observableError from "@/services/ErrorObserver";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  let toastTitle: string;
  let toastDescription: string;

  switch (error.message) {
    case ERROR_MESSAGES.CLIENT_ERROR.BAD_REQUEST.TITLE:
      toastTitle = ERROR_MESSAGES.CLIENT_ERROR.BAD_REQUEST.TITLE;
      toastDescription = ERROR_MESSAGES.CLIENT_ERROR.BAD_REQUEST.DESCRIPTION;
      break;
    case ERROR_MESSAGES.CLIENT_ERROR.UNAUTHORIZED.TITLE:
      toastTitle = ERROR_MESSAGES.CLIENT_ERROR.UNAUTHORIZED.TITLE;
      toastDescription = ERROR_MESSAGES.CLIENT_ERROR.UNAUTHORIZED.DESCRIPTION;
      break;
    case ERROR_MESSAGES.CLIENT_ERROR.FORBIDDEN.TITLE:
      toastTitle = ERROR_MESSAGES.CLIENT_ERROR.FORBIDDEN.TITLE;
      toastDescription = ERROR_MESSAGES.CLIENT_ERROR.FORBIDDEN.DESCRIPTION;
      break;
    case ERROR_MESSAGES.CLIENT_ERROR.NOT_FOUND.TITLE:
      toastTitle = ERROR_MESSAGES.CLIENT_ERROR.NOT_FOUND.TITLE;
      toastDescription = ERROR_MESSAGES.CLIENT_ERROR.NOT_FOUND.DESCRIPTION;
      break;
    case ERROR_MESSAGES.CLIENT_ERROR.METHOD_NOT_ALLOWED.TITLE:
      toastTitle = ERROR_MESSAGES.CLIENT_ERROR.METHOD_NOT_ALLOWED.TITLE;
      toastDescription = ERROR_MESSAGES.CLIENT_ERROR.METHOD_NOT_ALLOWED.DESCRIPTION;
      break;
    case ERROR_MESSAGES.CLIENT_ERROR.TOO_MANY_REQUESTS.TITLE:
      toastTitle = ERROR_MESSAGES.CLIENT_ERROR.TOO_MANY_REQUESTS.TITLE;
      toastDescription = ERROR_MESSAGES.CLIENT_ERROR.TOO_MANY_REQUESTS.DESCRIPTION;
      break;
    case ERROR_MESSAGES.SERVER_ERROR.INTERNAL_SERVER_ERROR.TITLE:
      toastTitle = ERROR_MESSAGES.SERVER_ERROR.INTERNAL_SERVER_ERROR.TITLE;
      toastDescription = ERROR_MESSAGES.SERVER_ERROR.INTERNAL_SERVER_ERROR.DESCRIPTION;
      break;
    case ERROR_MESSAGES.SERVER_ERROR.BAD_GATEWAY.TITLE:
      toastTitle = ERROR_MESSAGES.SERVER_ERROR.BAD_GATEWAY.TITLE;
      toastDescription = ERROR_MESSAGES.SERVER_ERROR.BAD_GATEWAY.DESCRIPTION;
      break;
    case ERROR_MESSAGES.SERVER_ERROR.SERVICE_UNAVAILABLE.TITLE:
      toastTitle = ERROR_MESSAGES.SERVER_ERROR.SERVICE_UNAVAILABLE.TITLE;
      toastDescription = ERROR_MESSAGES.SERVER_ERROR.SERVICE_UNAVAILABLE.DESCRIPTION;
      break;
    case ERROR_MESSAGES.SERVER_ERROR.GATEWAY_TIMEOUT.TITLE:
      toastTitle = ERROR_MESSAGES.SERVER_ERROR.GATEWAY_TIMEOUT.TITLE;
      toastDescription = ERROR_MESSAGES.SERVER_ERROR.GATEWAY_TIMEOUT.DESCRIPTION;
      break;
    default:
      toastTitle = ERROR_MESSAGES.DEFAULT.TITLE;
      toastDescription = ERROR_MESSAGES.DEFAULT.DESCRIPTION;
      break;
  }

  observableError.notify({ title: toastTitle, description: toastDescription });

  return (
    <div className="container border-2 p-3 rounded-md border-red-400/50 dark:border-red-400/30 bg-red-700 dark:bg-red-900">
      <h1 className="text-xl text-white/90 mb-2 font-semibold">Error</h1>
      <button className="bg-red-400/30 hover:bg-red-400/40 text-white rounded-md px-3 py-1" onClick={reset}>
        Try again
      </button>
    </div>
  );
}
