import { Request, Response, NextFunction } from "express";
import { ObjectSchema } from "joi";
import AppError from "../utils/AppError";
import { ErrorResponsesCode } from "../utils/constants";
import pick from "../utils/pick";

export default (schema: ObjectSchema) =>
  (req: Request, res: Response, next: NextFunction) => {
    const validSchema = pick(schema, ["params", "query", "body"]);
    const { value, error } = schema.validate(validSchema);

    if (error) {
      const errorMessage: string = error.details
        .map((details) => details.message)
        .join(", ");
      return next(new AppError(ErrorResponsesCode.BAD_REQUEST, errorMessage));
    }
    Object.assign(req, value);
    return next();
  };
