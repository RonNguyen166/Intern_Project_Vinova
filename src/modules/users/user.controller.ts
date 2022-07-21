import express from "express";
import jwt from "jsonwebtoken";

import UserService from "./user.services";
import UserSerializer from "./user.serializer";
import { User, IUser } from "./../../common/models/user.model";

export default class UserController {
  userService: UserService = new UserService();
  userSerializer: UserSerializer = new UserSerializer();
  getAllUsers = async <UserController>(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const doc = await this.userService.getAllUsers();
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

  getUser = async <UserController>(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const doc = await this.userService.getUser(req.params.id);
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

  createUser = async <UserController>(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const doc = await this.userService.createUser(req.body);
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

  signToken(id: any) {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
  }

  createSendToken(user: any, statusCode: number, res: express.Response) {
    const token = this.signToken(user._id);
    const cookieOption = {
      expires: new Date(
        Date.now() +
          ((process.env.JWT_COOKIE_EXPIRES_IN as any) || 90) *
            24 *
            60 *
            60 *
            1000
      ),
      httpOnly: true,
      secure: false,
    };
    res.cookie("jwt", token, cookieOption);

    user.password = "";

    return res.status(statusCode).json({
      status: "success",
      token,
      data: {
        user,
      },
    });
  }

  signUp = async <UserController>(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const newUser = await this.userService.createUser(req.body);
      //console.log(newUser);
      this.createSendToken(newUser, 201, res);
    } catch (err) {
      //console.log(err);
      return res.status(400).json({
        status: "error",
        message: err,
      });
    }
  };

  login = async <UserController>(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        status: "error",
        message: "Please provide email and password!",
      });
    }

    const user: IUser | null = await this.userService.findOneUser({ email });

    if (
      user === null ||
      !(await user.correctPassword(password, user.password))
    ) {
      return res.status(401).json({
        status: "error",
        message: "Incorrect email or password!",
      });
    }

    this.createSendToken(user, 200, res);
  };
}
