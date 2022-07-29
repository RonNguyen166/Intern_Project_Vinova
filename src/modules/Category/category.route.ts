import express, { Application, RequestHandler, Router } from "express";
import validate from "../../middlewares/validate.middleware";
import { create, getAll, getOne, updateOne, deleteOne } from "./category.schema";
import CategoryController from "./category.controller";
export default class DocumentRoute {
  public path: string = "/categories";
  public router: Router = Router();
  private categoryController = new CategoryController();
  constructor() {
    this.intializeRoute();
  }
  public intializeRoute(): void {
    this.router
      .route(`${this.path}/:id`)
      .get(validate(getOne), this.categoryController.getCategory)
      .patch(validate(updateOne), this.categoryController.updateCategory)
      .delete(validate(deleteOne), this.categoryController.deleteCategory)
    this.router
      .route(`${this.path}/`)
      .get(validate(getAll), this.categoryController.getAllCategorys)
      .post(validate(create), this.categoryController.createCategory);
  }
}
