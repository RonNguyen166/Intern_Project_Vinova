import { Router } from "express";
import { isAuthen } from "./../../middlewares/authen.middleware";
import PostController from "./post.controller";
import validate from "../../middlewares/validate.middleware";
import { create, getOne, updateOne, deleteOne, getFilter } from "./post.schema";

export default class PostRoute {
  public router: Router = Router();
  private postController = new PostController();

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
    this.router
      .route("/:id")
      .get(this.postController.getPost)
      .patch(isAuthen, validate(updateOne), this.postController.updatePost)
      .delete(isAuthen, validate(deleteOne), this.postController.deletePost);
  }
}
