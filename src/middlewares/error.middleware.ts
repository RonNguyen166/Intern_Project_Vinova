import mongoose from "mongoose";
import { Request, Response, NextFunction } from "express";
import AppError from "../utils/appError";
import { ErrorMessages, ErrorResponsesCode } from "../utils/constants";
import { errorReponse } from "../common/services/response.sevice";

export function errorConverter(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  let error: any = err;
  if (!(error instanceof AppError)) {
    const statusCode: number =
      error.statusCode || error instanceof mongoose.Error
        ? ErrorResponsesCode.BAD_REQUEST
        : ErrorResponsesCode.INTERNAL_SERVER_ERROR;
    const message: string =
      error.message || (ErrorMessages as any)[ErrorResponsesCode[statusCode]];
    error = new AppError(statusCode, message);
  }
  next(error);
}

export function errorHandler(
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  let { statusCode, message } = err;
  if (process.env.NODE_ENV === "production" && !err.isOperational) {
    statusCode = ErrorResponsesCode.INTERNAL_SERVER_ERROR;
    message = ErrorResponsesCode[statusCode];
  }
  res.locals.errorMessage = message;
  if (process.env.NODE_ENV === "development") {
    console.log(err);
  }
  return errorReponse(req, res, message, statusCode, err.stack);
}
