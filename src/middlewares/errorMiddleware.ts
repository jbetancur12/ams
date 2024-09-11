import { Prisma } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';

import { JsonWebTokenError } from 'jsonwebtoken';
import { sendBadRequestResponse, sendErrorResponse } from '../utils/responseHandler';

export const errorHandler = (error: any, request: Request, response: Response, next: NextFunction) => {
  // Log the error stack for debugging purposes

  /*

   REPLACE IT WITH WINSTON
    console.error(error.stack);
  */


  // Handle known Prisma errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    const res =
      process.env.APP_ENV == 'developement'
        ? { error: 'Prisma Error occurred', details: error }
        : { error: 'Error occurred' };

    return sendBadRequestResponse(response, res);
  }

  // Handle Json Web Token Error
  if (error instanceof JsonWebTokenError) {
    const res =
      process.env.APP_ENV == 'developement'
        ? { error: 'Json Web Token Error occurred', message: error }
        : { error: 'Error occurred' };
    return sendBadRequestResponse(response, res);
  }

  // Handle other types of errors
  const res = process.env.APP_ENV == 'developement' ? { message: error.message } : { message: 'Internal Server Error' };
  return sendErrorResponse(response, res);
};
