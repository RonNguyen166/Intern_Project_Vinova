import express from "express";
import jwt from "jsonwebtoken";
import { User, IUser } from "./../common/models/user.model";

export default class Authenticator {
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

  signUp = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const newUser = await User.create({
        name: req.body.name,
        password: req.body.password,
        email: req.body.email,
      });
      this.createSendToken(newUser, 201, res);
    } catch (err) {
      //console.log("hello world");
      //console.log(err);
      return res.status(400).json({
        status: "error",
        message: err,
      });
    }
  };

  login = async (
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

    const user: IUser | null = await User.findOne({ email });
    //console.log(!user == false);

    if (
      user === null ||
      !(await user.correctPassword(password, user.password))
    ) {
      return res.status(401).json({
        status: "error",
        message: "Incorrect email or password!",
      });
    }

    this.createSendToken(user as IUser, 200, res);
  };

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
        message: "PLease log in to get access",
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
