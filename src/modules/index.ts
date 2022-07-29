import express, { Application } from "express";
import AuthRoute from "./Authentication/auth.route";
import UserRouter from "./User/user.route";
export default class CombineRoute {
  private userRoute = new UserRouter();
  private authRoute = new AuthRoute();

  public start(app: Application) {
    app.use("/v1", this.userRoute.router);
    app.use("/v1", this.authRoute.router);
  }
}
