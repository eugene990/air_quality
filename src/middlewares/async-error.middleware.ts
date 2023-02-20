import { Request, Response, NextFunction } from 'express';

export type AsyncMiddleware = (request: Request, response: Response, next: NextFunction) => Promise<Response | void>;

/**
 * Wraps async middlewares with a '.catch' statement. Avoids adding try/catch to every controller.
 */
export const asyncErrorMiddleware = (function_: AsyncMiddleware): AsyncMiddleware => {
  return (request, response, next) => function_(request, response, next).catch(next);
};
