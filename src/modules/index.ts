import express, { Application } from "express";
import UserRouter from "./User/user.route";
export default class CombineRoute {
  private userRoute = new UserRouter();

  public start(app: Application) {
    app.use("/v1", this.userRoute.router);
  }
}
