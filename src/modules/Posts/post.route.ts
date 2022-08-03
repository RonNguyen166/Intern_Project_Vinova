import express from "express";
import CommentController from "../Comments/comment.controller";
import PostController from "./post.controller";
import {auth} from "./../../middlewares/authen.middleware";

const commentController = new CommentController();
const postController = new PostController();

const router = express.Router();

router
  .route("/")
  .get(postController.getAllPost)
  .post(auth("member", "admin"), postController.createPost);
router.route("/:postId/comments").get(commentController.getCommentsByPostId);

router
  .route("/:postId")
  .post(postController.createPost)
  .patch(postController.updatePost)
  .delete(postController.deletePost);
export default router;
