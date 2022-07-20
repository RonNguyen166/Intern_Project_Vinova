import express from "express";
import { User, IUser } from "./../../common/models/user.model";
import UserSerializer from "./user.serializer";
export default class UserService {
  userSerializer: UserSerializer = new UserSerializer();

  getAllUsers() {
    return async <UserService>(
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      try {
        const doc = await User.find();
        const serializedDoc =
          this.userSerializer.serializerQueryAndResponseUser(doc);
        return res.status(200).json({
          status: "success",
          length: doc.length,
          data: {
            users: serializedDoc,
          },
        });
      } catch (err) {
        console.log(err);
        return res.status(400).json({
          status: "error",
          message: err,
        });
      }
    };
  }

  getUser() {
    return async <UserService>(
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      try {
        const doc = await User.findById(req.params.id);
        const serializedDoc =
          this.userSerializer.serializerQueryAndResponseUser(doc);
        return res.status(200).json({
          status: "success",
          data: {
            user: serializedDoc,
          },
        });
      } catch (err) {
        return res.status(400).json({
          status: "error",
          message: err,
        });
      }
    };
  }

  createUser() {
    return async <UserService>(
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      try {
        const doc = await User.create(req.body);
        const serializedDoc =
          this.userSerializer.serializerQueryAndResponseUser(doc);
        return res.status(201).json({
          status: "success",
          user: { data: serializedDoc },
        });
      } catch (err) {
        return res.status(400).json({
          status: "error",
          message: err,
        });
      }
    };
  }
}
