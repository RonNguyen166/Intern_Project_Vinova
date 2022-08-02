import mongoose from "mongoose";
import ApiFeatures from "../../utils/apiFeatures";
import { Comment, IComment } from "./../../common/models/comment.model";
import { StringMappingType } from "typescript";

export default class CommentService {
  public async getAllComments(queryString: object) {
    try {
      const apiFeatures = new ApiFeatures(Comment.find(), queryString)
        .filter()
        .sort()
        .paginate();
      const comments = apiFeatures.query;
      return comments;
    } catch (err) {
      throw err;
    }
  }

  public async getComment(id: string) {
    try {
      const comment = await Comment.findOne({ _id: id });
      return comment;
    } catch (err) {
      throw err;
    }
  }

  public async createComment(body: object) {
    try {
      const comment = await Comment.create(body);
      return comment;
    } catch (err) {
      throw err;
    }
  }

  public async updateComment(id: string, body: object) {
    try {
      const comment = await Comment.findOneAndUpdate({ _id: id }, body);
      return comment;
    } catch (err) {
      throw err;
    }
  }

  public async deleteComment(id: string) {
    try {
      await Comment.findOneAndDelete({ _id: id });
    } catch (err) {
      throw err;
    }
  }

  public async getCommentsByPostId(postId: string, queryString: object) {
    try {
      const apiFeatures = await new ApiFeatures(
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
