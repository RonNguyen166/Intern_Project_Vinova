import express, { Application, RequestHandler, Router } from "express";
import validate from "../../middlewares/validate.middleware";
import { create, getAll, getOne, updateOne, deleteOne } from "./user.schema";
import UserController from "./user.controller";
export default class UserRoute {
  public path: string = "/users";
  public router: Router = Router();
  private userController = new UserController();
  constructor() {
    this.intializeRoute();
  }
  public intializeRoute(): void {
    this.router
      .route(`${this.path}/:id`)
      .get(validate(getOne), this.userController.getUser)
      .patch(validate(updateOne), this.userController.updateUser)
      .delete(validate(deleteOne), this.userController.deleteUser);

    this.router
      .route(`${this.path}/`)
      .get(validate(getAll), this.userController.getAllUsers)
      .post(validate(create), this.userController.createUser);
  }
}
