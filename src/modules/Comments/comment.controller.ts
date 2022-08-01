import express from "express";
import CommentService from "./comment.services";

export default class CommentController {
  private commentService: CommentService = new CommentService();
  public getAllComments = async <CommentController>(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const comments = await this.commentService.getAllComments(req.query);
      res.status(200).json({
        status: "success",
        length: comments.length,
        data: {
          comments,
        },
      });
    } catch (err) {
      res.status(400).json({
        status: "error",
        message: err,
      });
    }
  };

  public createComment = async <CommentController>(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const comment = await this.commentService.createComment(req.body);
      res.status(201).json({
        status: "success",
        data: {
          comment,
        },
      });
    } catch (err) {
      res.status(400).json({
        status: "error",
        message: err,
      });
    }
  };

  public getCommentsByPostId = async <CommentController>(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const comments = await this.commentService.getCommentsByPostId(
        req.params.postId,
        req.query
      );
    } catch (err) {
      res.status(400).json({
        status: "error",
        message: err,
      });
    }
  };
}
