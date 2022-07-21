import express from "express";
import jwt from "jsonwebtoken";
import { User, IUser } from "./../common/models/user.model";

export default class Authenticator {
  protect = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        status: "error",
        message: "Please log in to get access",
      });
    }
    try {
      const decoded = (await jwt.verify(token, process.env.JWT_SECRET)) as any;
      const currentUser = User.findById(decoded.id);

      if (!currentUser) {
        return res.status(401).json({
          status: "error",
          message: "No user with this token was found",
        });
      }

      /*
      #TODO: change password after...
      */

      //(<any>req).user = currentUser;
      req.user = currentUser;
      return next();
    } catch (err) {
      res.status(401).json({
        status: "error",
        message: "Invalid token!!!",
      });
    }
  };
}
