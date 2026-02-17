import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export interface CustomError extends Error {
  status?: number;
  code?: string;
}

export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  logger.error(`[${status}] ${message}`, {
    path: req.path,
    method: req.method,
    error: err,
  });

  const response: any = {
    error: {
      message,
      status,
    },
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const env = process.env.NODE_ENV;
  if (env === 'development') {
    response.error.stack = err.stack;
    response.error.details = err;
  }

  res.status(status).json(response);
};

export const asyncHandler = (
  fn: (req: AuthRequest, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export const ApiError = (message: string, status: number = 500): CustomError => {
  const error = new Error(message) as CustomError;
  error.status = status;
  return error;
};
