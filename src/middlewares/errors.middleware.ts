/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';

import { BaseAPIError, RouteNotFound } from '../helpers/api-errors';
import { toSnakeCase } from '../helpers/string';
import { generateApiError } from '../utils/errors';

/**
 * Middleware to handle requests to unknown or not found routes
 */
export const handleNotFound = (request: Request, response: Response): Response => {
  const error = new RouteNotFound();
  return response.status(error.status).json({ message: error.message, code: error.code });
};

/**
 * Middleware to catch and handle both expected and unexpected exceptions
 */
export const handleExceptions = (error: Error, request: Request, response: Response, _next: NextFunction): Response => {
  const apiError = error instanceof BaseAPIError ? error : generateApiError(error);

  const errorResponse = { ...apiError, name: undefined, status: undefined, report: undefined };

  if (apiError.report) {
    console.error(toSnakeCase(apiError.name), apiError.message, { error });

    // Sentry can't read our 'description' field for logging errors. So we pass it as 'message' instead.
    apiError.message = apiError.description ?? apiError.message;
  } else {
    console.warn(toSnakeCase(apiError.name), apiError.message, { error });
  }

  return response.status(apiError.status ?? StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse);
};
