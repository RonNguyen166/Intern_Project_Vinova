import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import Token from "../utils/token";
import UserService from "../modules/User/user.services";
import User, { IUser } from "../common/models/user.model";
import { serializerGetUser } from "../modules/User/user.serializer";
import { ErrorResponsesCode } from "../utils/constants";
import AppError from "../utils/appError";

const isAuthen = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const authHeader: string = <string>req.headers["authorization"];
    const token: string = authHeader && authHeader.split(" ")[1];
    const decoded = await new Token().verifyToken(token);
    const user = await new UserService(User).getUser({ _id: decoded.sub });
    (<any>req).authenticatedUser = serializerGetUser(user);
    next();
  }
);

const permission =
  (...roles: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes((<any>req).authenticatedUser.role)) {
      return next(
        new AppError(
          ErrorResponsesCode.FORBIDDEN,
          "You do not have permission to perform this action."
        )
      );
    } else {
      (<any>req).authorizedUser = (<any>req).authorizatedUser;
      next();
    }
  };

const verifyCallback =
  (req: Request, resolve: any, reject: any, roles: string[]) =>
  async (err?: Error, user?: IUser) => {
    if (err || !user) {
      return reject(
        new AppError(ErrorResponsesCode.UNAUTHORIZED, "Please authenticate")
      );
    }
    (<any>req).authenticatedUser = serializerGetUser(user);
    if (roles.length && !roles.includes((<any>req).authenticatedUser.role)) {
      return reject(
        new AppError(
          ErrorResponsesCode.FORBIDDEN,
          "You do not have permission to perform this action."
        )
      );
    }
    resolve();
  };

const auth =
  (...roles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    return new Promise(async (resolve, reject) => {
      try {
        const authHeader: string = <string>req.headers["authorization"];
        const token: string = authHeader && authHeader.split(" ")[1];
        const decoded = await new Token().verifyToken(token);
        const user = await new UserService(User).getUser({ _id: decoded.sub });
        await verifyCallback(req, resolve, reject, roles)(undefined, user);
      } catch (err: any) {
        await verifyCallback(req, resolve, reject, roles)(err, undefined);
      }
    })
      .then(() => next())
      .catch((err) => next(err));
  };

export { isAuthen, permission, auth };
