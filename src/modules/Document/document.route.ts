import express, { Application, RequestHandler, Router } from "express";
import validate from "../../middlewares/validate.middleware";
import { create, getAll, getOne, updateOne, deleteOne } from "./document.schema";
import DocumentController from "./document.controller";
export default class DocumentRoute {
  public path: string = "/documents";
  public router: Router = Router();
  private documentController = new DocumentController();
  constructor() {
    this.intializeRoute();
  }
  public intializeRoute(): void {
    this.router
      .route(`${this.path}/:id`)
      .get(validate(getOne), this.documentController.getDocument)
      .patch(validate(updateOne), this.documentController.updateDocument)
      .delete(validate(deleteOne), this.documentController.deleteDocument)
    this.router
      .route(`${this.path}/`)
      .get(validate(getAll), this.documentController.getAllDocuments)
      .post(validate(create), this.documentController.createDocument);
  }
}
