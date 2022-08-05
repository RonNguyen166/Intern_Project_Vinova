import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import Token from "../utils/token";
import UserService from "../modules/User/user.services";
import User, { IUser } from "../common/models/user.model";
import { serializerGetUser } from "../modules/User/user.serializer";
import { ErrorResponsesCode } from "../utils/constants";
import AppError from "../utils/appError";

export const isAuthen = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader: string = <string>req.headers["authorization"];
      const token: string = authHeader && authHeader.split(" ")[1];
      const decoded = await new Token().verifyToken(token);
      const user = await new UserService(User).getUser({ _id: decoded.sub });
      if (!user) throw new Error();
      (<any>req).authenticatedUser = serializerGetUser(user);
      console.log(req.authenticatedUser);
      next();
    } catch (err) {
      throw new AppError(
        ErrorResponsesCode.UNAUTHORIZED,
        "Please authenticate"
      );
    }
  }
);

export const isAuthor = catchAsync(
  (req: Request, res: Response, next: NextFunction) => {
    const isAdmin = (<any>req).authenticatedUser?.isAdmin;
    if (isAdmin) {
      // (<any>req).authorizedUser = (<any>req).authorizatedUser;
      next();
    } else {
      throw new AppError(
        ErrorResponsesCode.FORBIDDEN,
        "You do not have permission to perform this feature."
      );
    }
  }
);
