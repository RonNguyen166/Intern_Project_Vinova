import express, { Application } from "express";
import DocumentRoute from "./Document/document.route";
import UserRouter from "./User/user.route";
import BranchRoute from "./Branch/branch.route";
import CategoryRoute from "./Category/category.route";
export default class CombineRoute {
  private userRoute = new UserRouter();
  private documentRoute = new DocumentRoute();
  private branchRoute = new BranchRoute();
  private categoryRoute = new CategoryRoute();


  public start(app: Application) {
    app.use("/v1", this.userRoute.router);
    app.use("/v1", this.documentRoute.router);
    app.use("/v1", this.branchRoute.router);
    app.use("/v1", this.categoryRoute.router);

    
  }
}
