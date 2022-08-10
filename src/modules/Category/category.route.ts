import { Router } from "express";
import { isAuthen, isAuthor } from "../../middlewares/authen.middleware";
import validate from "../../middlewares/validate.middleware";
import {
  create,
  getAll,
  getOne,
  updateOne,
  deleteOne,
} from "./category.schema";
import CategoryController from "./category.controller";
export default class DocumentRoute {
  public router: Router = Router();
  private categoryController = new CategoryController();
  constructor() {
    this.intializeRoute();
  }
  public intializeRoute(): void {
    this.router
      .route(`/:id`)
      .get(isAuthen, validate(getOne), this.categoryController.getCategory)
      .patch(
        isAuthen,
        isAuthor,
        validate(updateOne),
        this.categoryController.updateCategory
      )
      .delete(
        isAuthen,
        isAuthor,
        validate(deleteOne),
        this.categoryController.deleteCategory
      );

    this.router
      .route(`/`)
      .get(isAuthen, validate(getAll), this.categoryController.getAllCategorys)
      .post(
        isAuthen,
        isAuthor,
        validate(create),
        this.categoryController.createCategory
      );
  }
}
