import { Request, Response } from "express";
import { ErrorMessages } from "../../utils/constants";

export const successReponse = (
  req: Request,
  res: Response,
  data: any,
  message: string,
  code?: number
) => {
  if (!res.headersSent) {
    res.status(code || 200).json({
      code: code || 200,
      success: true,
      message,
      result: data,
    });
  }
};

export const errorReponse = (
  req: Request,
  res: Response,
  message: string,
  code?: number,
  stack?: any
) => {
  if (!res.headersSent) {
    res.status(code || 500).json({
      code: code || 500,
      success: false,
      message: message || ErrorMessages.INTERNAL_SERVER_ERROR,
      ...(process.env.NODE_ENV !== "development" && { stack: stack }),
    });
  }
};
