import { StatusCodes } from "http-status-codes";

interface ErrorOptions {
  report?: boolean;
}

export class BaseAPIError extends Error {
  /** Internal error code */
  code: string;
  /** HTTP status code */
  status?: number;
  /** Error description or detail if necessary */
  description?: string;
  /** Property for reporting to Sentry */
  report = false;

  constructor(description?: string, options?: ErrorOptions) {
    super();
    this.name = this.constructor.name;
    this.code = 'E00001';

    this.description = description;
    this.report = !!options?.report;

    Error.captureStackTrace(this, BaseAPIError);
  }
}

/*
  Server errors with codes
*/

/**
 * Generic internal server error for unexpected exceptions
 */
export class UnexpectedError extends BaseAPIError {
  message = 'Unexpected error occured';
  status = StatusCodes.INTERNAL_SERVER_ERROR;
  code = 'E00001';
  report = true;
}

/**
 * Requested path was not found
 */
export class RouteNotFound extends BaseAPIError {
  message = 'Route not found';
  status = StatusCodes.NOT_FOUND;
  code = 'E00002';
}

/**
 * Specific resource was not found
 */
export class ResourceNotFound extends BaseAPIError {
  message = 'Resource not found';
  status = StatusCodes.NOT_FOUND;
  code = 'E00003';
}

/**
 * Form body validation error (for POST, PUT, PATCH requests)
 */
export class BodyValidationError extends BaseAPIError {
  message = 'Form body validation error';
  status = StatusCodes.BAD_REQUEST;
  code = 'E00004';
  errors!: Record<string, unknown>[];
}

/**
 * Query string validation error (for GET requests)
 */
export class QueryStringValidationError extends BaseAPIError {
  message = 'Query string parameters validation error';
  status = StatusCodes.BAD_REQUEST;
  code = 'E00005';
  errors!: Record<string, unknown>[];
}

/**
 * Some external web service (i.e i-api) is failing
 */
export class ExternalServiceError extends BaseAPIError {
  message = 'External service failing to process requests';
  status = StatusCodes.BAD_GATEWAY;
  code = 'E00006';
  report = true;
}

/**
 * Authentication failed for request
 */
export class AuthenticationFailed extends BaseAPIError {
  message = 'Authentication failed';
  status = StatusCodes.UNAUTHORIZED;
  code = 'E00010';
}

/**
 * Session JWT is expired
 */
export class SessionTokenExpired extends BaseAPIError {
  message = 'Session token expired';
  status = StatusCodes.UNAUTHORIZED;
  code = 'E00011';
}

/**
 * Session doesn't have permissions to perform the requested action
 */
export class AccessDeniedError extends BaseAPIError {
  message = 'Access Denied';
  status = StatusCodes.FORBIDDEN;
  code = 'E00012';
}
