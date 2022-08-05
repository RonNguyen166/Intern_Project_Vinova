import { Router } from "express";
import PostController from "./post.controller";

import validate from "../../middlewares/validate.middleware";
import { create, getOne, updateOne, deleteOne, getFilter } from "./post.schema";
import CommentController from "../Comments/comment.controller";

import { isAuthen, isAuthor } from "../../middlewares/authen.middleware";

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
      .post(isAuthen, validate(create), this.postController.createPost);

    this.router
      .route("/filter")
      .get(validate(getFilter), this.postController.getFilterPosts);
    this.router.get("/my-posts", isAuthen, this.postController.getMyPosts);

    this.router.get("/:id/comments", this.commentController.getCommentsByPost);

    this.router
      .route("/:id")
      .get(this.postController.getPost)
      .patch(isAuthen, validate(updateOne), this.postController.updatePost)
      .delete(isAuthen, validate(deleteOne), this.postController.deletePost);

    // this.router
    //   .route("/:postId/comments")
    //   .get(this.commentController.getComment);

    this.router.post(
      "/comments",
      isAuthen,
      this.commentController.createComment
    );

    this.router
      .route("/:postId/comments/:commentId")
      .get(this.commentController.getCommentByPost)
      .patch(isAuthen, this.commentController.updateComment)
      .delete(isAuthen, this.commentController.deleteComment);
  }
}
