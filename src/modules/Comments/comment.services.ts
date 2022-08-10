import { Model } from "mongoose";
import Comment, { IComment } from "../../common/models/comment.model";
import Post from "../../common/models/post.model";
import { BaseRepository } from "../../common/repository/base.repository";
import AppError from "../../utils/appError";
import { Transaction } from "../../common/models/transaction.model";
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
  async getCommentsByPost(parentId: string, limit: any): Promise<any> {
    const comments = await Comment.find({ parent_id: parentId })
      .limit(parseInt(limit) || 0)
      .exec();
    return comments;
  }

  async getCommentByPost(params: any): Promise<any> {
    const { parentId, commentId } = params;
    const comment = await Comment.findOne({
      parent_id: parentId,
      _id: commentId,
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
      const post = await Post.findById(data.parent_id);
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

  async createCommentTransaction(data: any): Promise<any> {
    try {
      const transaction = await Transaction.findById(data.parent_id);
      if (transaction) {
        const comment = await this.create(data);
        transaction.comments.push(comment.id);
        return await transaction.save();
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

  async createCommentReply(data: any): Promise<any> {
    try {
      const { parent_id } = data;
      const comment = await this.getOne({ _id: parent_id });
      if (!comment.reply) {
        const reply = await this.create(data);
        comment.replies.push(reply.id);
        reply.reply = true;
        await comment.save();
        return await reply.save();
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
  async updateComment(user: any, params: any, data: any) {
    try {
      const { parentId, commentId } = params;
      const comment = await Comment.findOne({
        _id: commentId,
        parent_id: parentId,
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
  async getReply(params: any): Promise<any> {
    const { parentId, replyId } = params;
    const reply = await Comment.findOne({
      _id: replyId,
      parent_id: parentId,
    });
    if (!reply) {
      throw new AppError(
        ErrorResponsesCode.BAD_REQUEST,
        ErrorMessages.BAD_REQUEST
      );
    }
    return reply;
  }
  async updateReply(user: any, params: any, data: any): Promise<any> {
    try {
      const { parentId, replyId } = params;
      const reply = await Comment.findOne({
        _id: replyId,
        parent_id: parentId,
      });
      if (!reply) {
        throw new AppError(
          ErrorResponsesCode.BAD_REQUEST,
          ErrorMessages.BAD_REQUEST
        );
      }

      const isAccess = (<any>reply).user_id.equals(user._id) || user.isAdmin;
      if (isAccess) {
        reply.content = data.content;
        reply.save();
      } else {
        throw new AppError(
          ErrorResponsesCode.BAD_REQUEST,
          "You do not have permission to perform this feature."
        );
      }
      return reply;
    } catch (err) {
      throw err;
    }
  }
  async deleteReply(user: any, params: any) {
    try {
      const { parentId, replyId } = params;
      const reply = await Comment.findOne({
        _id: replyId,
        parent_id: parentId,
      });
      if (!reply) {
        throw new AppError(
          ErrorResponsesCode.BAD_REQUEST,
          ErrorMessages.BAD_REQUEST
        );
      }

      const isAccess = (<any>reply).user_id.equals(user._id) || user.isAdmin;
      if (isAccess) {
        await Comment.findByIdAndUpdate(parentId, {
          $pull: { replies: reply.id },
        });
        await reply.remove();
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
  async deleteComment(user: any, params: any) {
    try {
      const { parentId, commentId } = params;
      const comment = await this.getOne({
        _id: commentId,
        parent_id: parentId,
      });
      if (!comment) {
        throw new AppError(
          ErrorResponsesCode.BAD_REQUEST,
          ErrorMessages.BAD_REQUEST
        );
      }
      const isAccess = (<any>comment).user_id.equals(user._id) || user.isAdmin;
      if (isAccess) {
        await Post.findByIdAndUpdate(comment.parent_id, {
          $pull: { comments: comment.id },
        });
        await Promise.all(
          comment.replies.map(async (reply: any) => {
            await Comment.findByIdAndDelete(reply);
          })
        );
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

  // async getCommentsByPostId(postId: string, queryString: object): Promise<any> {
  //   try {
  //     const apiFeatures = new ApiFeatures(
  //       Comment.find({ postId: postId }),
  //       queryString
  //     )
  //       .filter()
  //       .sort()
  //       .paginate();
  //     return apiFeatures;
  //   } catch (err) {
  //     throw err;
  //   }
  // }
}
