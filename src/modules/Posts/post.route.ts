import express from "express";
import CommentController from "../Comments/comment.controller";
import PostController from "./post.controller";
import {isAuthor, isAuthen} from "./../../middlewares/authen.middleware";
import { upload } from "../../common/services/upload2.service";

const commentController = new CommentController();
const postController = new PostController();

const router = express.Router();

router
  .route("/")
  .get(postController.getAllPost)
  .post(isAuthen, isAuthor, upload.single("photo"),postController.createPost);
router.route("/:postId/comments").get(commentController.getCommentsByPostId);

router
  .route("/:postId")
  .post(postController.createPost)
  .patch(postController.updatePost)
  .delete(postController.deletePost);
export default router;
