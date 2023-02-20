import { StatusCodes } from "http-status-codes";

import { BaseAPIError, ExternalServiceError, UnexpectedError, BodyValidationError } from '../helpers/api-errors';

export type RequestError = Error & { code: string };

/** Possible network error codes from calling another HTTP service */
const NETWORK_ERRORS = new Set([
  'ETIMEDOUT',
  'ECONNRESET',
  'EADDRINUSE',
  'ESOCKETTIMEDOUT',
  'ECONNREFUSED',
  'EPIPE',
  'EHOSTUNREACH',
  'EAI_AGAIN',
]);

const isRequestError = (error: Error): error is RequestError => {
  return 'code' in error;
};

/**
 * Converts generic errors to a compatible API error (which can be sent in response)
 * @internal
 */
export const generateApiError = (error: Error): BaseAPIError => {
  let apiError: BaseAPIError | undefined;

  if ('statusCode' in error && error.statusCode === StatusCodes.BAD_REQUEST) {
    apiError = new BodyValidationError(error.message);
  }

  if (!apiError) {
    apiError =
      isRequestError(error) && NETWORK_ERRORS.has(error.code.trim())
        ? new ExternalServiceError(error.message)
        : new UnexpectedError(error.message);
  }

  apiError.stack = error.stack;

  return apiError;
};
