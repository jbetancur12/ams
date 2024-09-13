import { Prisma } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';
import { JsonWebTokenError } from 'jsonwebtoken';
import { sendBadRequestResponse, sendErrorResponse } from '../utils/responseHandler';
import { config } from '../config/config';
import { ZodError } from 'zod';
import { CustomError } from '../services/customError';
import log from '../utils/logger';

export const errorHandler = (error: unknown, request: Request, response: Response, next: NextFunction) => {
  // Log the error stack for debugging in development mode
  if (config.APP_ENV === 'development') {
    log.error(error instanceof Error ? error.stack : error);
  }

  // Zod validation error handling
  if (error instanceof ZodError) {
    const formattedErrors = error.errors.map((err) => ({
      path: err.path.join('.'),
      message: err.message,
    }));

    return sendBadRequestResponse(response, {
      message: 'Error de validación',
      errors: formattedErrors,
    });
  }

  // Prisma errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    const res =
      config.APP_ENV === 'development'
        ? { error: 'Prisma Error', details: error.message }
        : { error: 'Error occurred' };

    return sendBadRequestResponse(response, res);
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    const res =
      config.APP_ENV === 'development'
        ? { error: 'Prisma Validation Error', details: error.message }
        : { error: 'Error occurred' };

    return sendBadRequestResponse(response, res);
  }

  // JWT errors
  if (error instanceof JsonWebTokenError) {
    const res =
      config.APP_ENV === 'development'
        ? { error: 'JWT Error', message: error.message }
        : { error: 'Authentication failed' };

    return sendBadRequestResponse(response, res);
  }

  if (error instanceof CustomError) {
    return sendBadRequestResponse(response, {
      message: error.message,
      details: error.details,
      statusCode: error.statusCode,
    });
  }

  // General errors
  if (error instanceof Error) {
    const res =
      config.APP_ENV === 'development'
        ? { message: error.message, stack: error.stack }
        : { message: 'Internal Server Error' };

    return sendErrorResponse(response, res);
  }

  // Fallback for unknown errors
  const res =
    config.APP_ENV === 'development'
      ? { message: 'Unknown Error', details: error }
      : { message: 'Internal Server Error' };

  return sendErrorResponse(response, res);
};
