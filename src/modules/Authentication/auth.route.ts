import { Router } from "express";
import validate from "../../middlewares/validate.middleware";
import {
  login,
  register,
  forgotPassword,
  resetPassword,
  verifyEmail,
  updatePassword,
} from "./auth.schema";
import AuthController from "./auth.controller";
import { isAuthen } from "../../middlewares/authen.middleware";

export default class AuthRoute {
  public router: Router = Router();
  private authController: AuthController = new AuthController();
  constructor() {
    this.intializeRoute();
  }

  public intializeRoute() {
    this.router
      .post("/register", validate(register), this.authController.register)
      .post("/login", validate(login), this.authController.login)
      .post("/logout", this.authController.logout)
      .post(
        "/forgot-password",
        validate(forgotPassword),
        this.authController.forgotPassword
      )
      .post(
        "/reset-password",
        validate(resetPassword),
        this.authController.resetPassword
      )
      .post("/refresh-tokens", this.authController.refreshToken)
      .post(
        "/send-verification-email",
        isAuthen,
        this.authController.sendVerificationEmail
      )
      .get(
        "/verify-email",
        validate(verifyEmail),
        this.authController.verifyEmail
      )
      .patch(
        "/update-password",
        isAuthen,
        validate(updatePassword),
        this.authController.updateAuthPassword
      );
  }
}
