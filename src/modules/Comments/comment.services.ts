
import mongoose, { Model } from "mongoose";
import Comment, { IComment } from "../../common/models/comment.model";
import { BaseRepository } from "../../common/repository/base.repository";
import AppError from "../../utils/appError";
import { ErrorResponsesCode } from "../../utils/constants";
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

  async getComment (commentId: any): Promise<any> {
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

  async createComment(data: any): Promise<any> {
    try {
      const comment = await this.create(data);
      return comment;
    } catch (err) {
      throw err;
    }
  }

  async updateComment (commentId: any, data: object) {
    try {
      const comment = await this.update({ _id: commentId }, data);
      if (!comment) {
        throw new AppError(ErrorResponsesCode.NOT_FOUND, "Comment not Exist");
      }
      return comment;
    } catch (err) {
      throw err;
    }
  }
  async deleteComment (commentId: any) {
    try {
      const comment = await this.delete({ _id: commentId });
      if (!comment) {
        throw new AppError(ErrorResponsesCode.NOT_FOUND, "Comment not Exist");
      }
      return comment;
    } catch (err) {
      throw err;
    }
  }
  async getCommentsByPostId(postId: string, queryString: object): Promise<any>{
    try{
      const apiFeatures = new ApiFeatures(Comment.find({postId: postId }), queryString)
      .filter()
      .sort()
      .paginate();
    return apiFeatures
    }catch (err){
      throw err;
    }
  }
}
