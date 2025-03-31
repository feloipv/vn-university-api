import { CustomError } from '@/utils/errorUtils';
import { Request, Response, NextFunction } from 'express';

interface ErrorResponse {
  statusCode: number;
  message: string;
  errors?: string[];
}

export const errorHandler = (
  err: CustomError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const statusCode = err.statusCode || 500;

  const response: ErrorResponse = {
    statusCode,
    message: err.message || 'Internal Server Error',
    errors: err.errors,
  };

  res.status(statusCode).json(response);
};

export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};
