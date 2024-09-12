import { Prisma } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';
import { JsonWebTokenError } from 'jsonwebtoken';
import { sendBadRequestResponse, sendErrorResponse } from '../utils/responseHandler';
import { config } from '../config/config';

export const errorHandler = (error: unknown, request: Request, response: Response, next: NextFunction) => {
  // Log the error stack for debugging purposes
  if (config.APP_ENV === 'development') {
    console.error(error instanceof Error ? error.stack : error);
  }

  // Handle known Prisma errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    const res =
      config.APP_ENV === 'development'
        ? { error: 'Prisma Error occurred', details: error.message }
        : { error: 'Error occurred' };

    return sendBadRequestResponse(response, res);
  }

  // Handle Json Web Token Error
  if (error instanceof JsonWebTokenError) {
    const res =
      config.APP_ENV === 'development'
        ? { error: 'Json Web Token Error occurred', message: error.message }
        : { error: 'Error occurred' };

    return sendBadRequestResponse(response, res);
  }

  // Handle general errors
  if (error instanceof Error) {
    const res =
      config.APP_ENV === 'development'
        ? { message: error.message, stack: error.stack }
        : { message: 'Internal Server Error' };

    return sendErrorResponse(response, res);
  }

  // If the error is not an instance of Error, handle it as a generic internal error
  const res =
    config.APP_ENV === 'development'
      ? { message: 'Unknown Error', details: error }
      : { message: 'Internal Server Error' };

  return sendErrorResponse(response, res);
};
