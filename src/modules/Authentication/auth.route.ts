import { Router } from "express";
import validate from "../../middlewares/validate.middleware";
import {
  login,
  register,
  forgotPassword,
  resetPassword,
  verifyEmail,
} from "./auth.schema";
import AuthController from "./auth.controller";
import { auth } from "../../middlewares/authen.middleware";

export default class AuthRoute {
  public path: string = "/auth";
  public router: Router = Router();
  private authController: AuthController = new AuthController();
  constructor() {
    this.intializeRoute();
  }

  public intializeRoute(): void {
    this.router
      .post(
        `${this.path}/register`,
        validate(register),
        this.authController.register
      )
      .post(`${this.path}/login`, validate(login), this.authController.login)
      .post(`${this.path}/logout`, this.authController.logout)
      .post(
        `${this.path}/forgot-password`,
        validate(forgotPassword),
        this.authController.forgotPassword
      )
      .post(
        `${this.path}/reset-password`,
        validate(resetPassword),
        this.authController.resetPassword
      )
      .post(`${this.path}/refresh-tokens`, this.authController.refreshToken)
      .post(
        `${this.path}/send-verification-email`,
        auth(),
        this.authController.sendVerificationEmail
      )
      .get(
        `${this.path}/verify-email`,
        validate(verifyEmail),
        this.authController.verifyEmail
      );
  }
}
