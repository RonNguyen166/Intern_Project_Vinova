import express, { Application, RequestHandler, Router } from "express";
import { isAuthen, isAuthor } from "../../middlewares/authen.middleware";
import validate from "../../middlewares/validate.middleware";
import { create, getAll, getOne, updateOne, deleteOne } from "./comment.schema";
import CommentController from "./comment.controller";
export default class DocumentRoute {
  public path: string = "/comments";
  public router: Router = Router();
  private commentController = new CommentController();
  constructor() {
    this.intializeRoute();
  }
  public intializeRoute(): void {
    this.router
      .route(`${this.path}/:id`)
      .get(
        isAuthen,  
        validate(getOne), 
        this.commentController.getComment)
      .patch(
        isAuthen, 
        isAuthor,
        validate(updateOne), 
        this.commentController.updateComment)
      .delete(
        isAuthen, 
        isAuthor,
        validate(deleteOne), 
        this.commentController.deleteComment)
    this.router
      .route(`${this.path}/`)
      .get(
        isAuthen, 
        validate(getAll), 
        this.commentController.getAllComments)
      .post(
        isAuthen, 
        isAuthor,
        validate(create), 
        this.commentController.createComment);
  }
}