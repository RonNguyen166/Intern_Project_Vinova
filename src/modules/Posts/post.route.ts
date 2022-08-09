import { Router } from "express";
import PostController from "./post.controller";

import validate from "../../middlewares/validate.middleware";
import * as postValidation from "./post.schema";
import * as commentValidation from "../Comments/comment.schema";
import CommentController from "../Comments/comment.controller";

import { isAuthen } from "../../middlewares/authen.middleware";

export default class PostRoute {
  public router: Router = Router();
  private postController = new PostController();
  private commentController = new CommentController();

  constructor() {
    this.initializeRoute();
  }
  public initializeRoute() {
    this.router
      .route("/")
      .get(this.postController.getAllPosts)
      .post(
        isAuthen,
        validate(postValidation.create),
        this.postController.createPost
      );

    this.router
      .route("/filter")
      .get(
        validate(postValidation.getFilter),
        this.postController.getFilterPosts
      );
    this.router.get("/my-posts", isAuthen, this.postController.getMyPosts);

    this.router.get(
      "/:id/comments",
      validate(postValidation.getComments),
      this.commentController.getCommentsByPost
    );

    this.router
      .route("/:id")
      .get(validate(postValidation.paramId), this.postController.getPost)
      .patch(
        isAuthen,
        validate(postValidation.updateOne),
        this.postController.updatePost
      )
      .delete(
        isAuthen,
        validate(postValidation.paramId),
        this.postController.deletePost
      );

    this.router.post(
      "/comments",
      isAuthen,
      validate(commentValidation.create),
      this.commentController.createComment
    );

    this.router
      .route("/:parentId/comments/:commentId")
      .get(
        validate(commentValidation.getOne),
        this.commentController.getCommentByPost
      )
      .patch(isAuthen, this.commentController.updateComment)
      .delete(isAuthen, this.commentController.deleteComment);

    this.router.patch(
      "/:id/to-view",
      validate(postValidation.paramId),
      this.postController.toView
    );
    this.router.patch(
      "/:id/to-favorite",
      isAuthen,
      validate(postValidation.paramId),
      this.postController.toFavorite
    );
  }
}
