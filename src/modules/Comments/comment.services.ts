import mongoose, { Model } from "mongoose";
import Comment, { IComment } from "../../common/models/comment.model";
import Post from "../../common/models/post.model";
import { BaseRepository } from "../../common/repository/base.repository";
import AppError from "../../utils/appError";

import { ErrorMessages, ErrorResponsesCode } from "../../utils/constants";

import ApiFeatures from "../../utils/apiFeatures";
export default class CommentService extends BaseRepository<IComment> {
  constructor(public readonly commentRepository: Model<IComment>) {
    super(commentRepository);
  }
  async getAllComments(queryString: object): Promise<any> {
    try {
      const apiFeatures = new ApiFeatures(Comment.find(), queryString)
        .filter()
        .sort()
        .paginate();
      const comments = apiFeatures.query;
      if (!comments) {
        throw new AppError(ErrorResponsesCode.NOT_FOUND, "Comments not Exist");
      }
      return comments;
    } catch (err) {
      throw err;
    }
  }

  async getComment(commentId: any): Promise<any> {
    try {
      const comment = await this.getOne({ _id: commentId });
      if (!comment) {
        throw new AppError(ErrorResponsesCode.NOT_FOUND, "Comment not Exist");
      }
      return comment;
    } catch (err) {
      throw err;
    }
  }
  async getCommentsByPost(postId: string, limit: any): Promise<any> {
    const comments = await Comment.find({ post_id: postId })
      .limit(parseInt(limit) || 0)
      .exec();
    return comments;
  }

  async getCommentByPost(params: any): Promise<any> {
    const { postId, commentId } = params;
    const comment = await Comment.findOne({
      post_id: postId,
      comment_id: commentId,
    })
      .populate("user_id", "fullName email photo")
      .exec();
    if (!comment) {
      throw new AppError(
        ErrorResponsesCode.BAD_REQUEST,
        ErrorMessages.BAD_REQUEST
      );
    }
    return comment;
  }
  async createComment(data: any): Promise<any> {
    try {
      const post = await Post.findById(data.post_id);
      if (post) {
        const comment = await this.create(data);
        post.comments.push(comment.id);
        return await post.save();
      } else {
        throw new AppError(
          ErrorResponsesCode.BAD_REQUEST,
          ErrorMessages.BAD_REQUEST
        );
      }
    } catch (err) {
      throw err;
    }
  }
  async createCommentReply(commentId: string, data: any): Promise<any> {
    try {
      const comment = await this.getOne({ _id: commentId });
      if (comment.post_id) {
        const reply = await this.create(data);
        comment.parent_id.push(reply.id);
        return await comment.save();
      }
    } catch (err) {
      throw err;
    }
  }
  async updateComment(user: any, params: any, data: any) {
    try {
      const { postId, commentId } = params;
      const comment = await Comment.findOne({
        _id: commentId,
        post_id: postId,
      });
      if (!comment) {
        throw new AppError(
          ErrorResponsesCode.BAD_REQUEST,
          ErrorMessages.BAD_REQUEST
        );
      }
      const isAccess = (<any>comment).user_id.equals(user._id) || user.isAdmin;
      if (isAccess) {
        comment.content = data.content;
        comment.save();
      } else {
        throw new AppError(
          ErrorResponsesCode.BAD_REQUEST,
          "You do not have permission to perform this feature."
        );
      }
      return comment;
    } catch (err) {
      throw err;
    }
  }
  async deleteComment(user: any, params: any) {
    try {
      const { postId, commentId } = params;
      const comment = await this.getOne({ _id: commentId, post_id: postId });
      if (!comment) {
        throw new AppError(
          ErrorResponsesCode.BAD_REQUEST,
          ErrorMessages.BAD_REQUEST
        );
      }
      const isAccess = (<any>comment).user_id.equals(user._id) || user.isAdmin;
      if (isAccess) {
        await Post.findByIdAndUpdate(comment.post_id, {
          $pull: { comments: comment.id },
        });
        await comment.remove();
      } else {
        throw new AppError(
          ErrorResponsesCode.BAD_REQUEST,
          "You do not have permission to perform this feature."
        );
      }
    } catch (err) {
      throw err;
    }
  }
  async getCommentsByPostId(postId: string, queryString: object): Promise<any> {
    try {
      const apiFeatures = new ApiFeatures(
        Comment.find({ postId: postId }),
        queryString
      )
        .filter()
        .sort()
        .paginate();
      return apiFeatures;
    } catch (err) {
      throw err;
    }
  }
}
