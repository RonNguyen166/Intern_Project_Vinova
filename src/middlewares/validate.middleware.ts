import { Request, Response, NextFunction } from "express";
import { ObjectSchema } from "joi";
import AppError from "../utils/appError";
import { ErrorResponsesCode } from "../utils/constants";
import pick from "../utils/pick";

export default (schema: ObjectSchema) =>
  (req: Request, res: Response, next: NextFunction) => {
    const validSchema = pick(schema.describe().keys, [
      "params",
      "query",
      "body",
    ]);
    const object = pick(req, Object.keys(validSchema));
    const { value, error } = schema.validate(object);

    if (error) {
      const errorMessage: string = error.details
        .map((details) => details.message)
        .join(", ");
      return next(new AppError(ErrorResponsesCode.BAD_REQUEST, errorMessage));
    }
    Object.assign(req, value);
    return next();
  };
