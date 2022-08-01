import mongoose from "mongoose";
import ApiFeature from "../../utils/apiFeatures";
import { IPost, Post } from "./../../common/models/post.model";

export default class PostService {
  public async getAllPost(queryString: object) {
    try {
      const apiFeature = await new ApiFeature(Post.find(), queryString)
        .filter()
        .sort()
        .paginate();
      const posts = apiFeature.query
        .populate("user_id", "-password -createdAt -updatedAt -__v")
        .populate("category");
      return posts;
    } catch (err) {
      throw err;
    }
  }
  public async getPost(id: string) {
    try {
      const post = await Post.findById(id)
        .populate("user_id", "-password -createdAt -updatedAt -__v")
        .populate("category");
      if (!post) {
        throw "Post with this id not exist";
      }
      post.views += 1;
      post.save();
      return post;
    } catch (err) {
      throw err;
    }
  }
  public async createPost(body: object) {
    try {
      const post = await Post.create(body);
      return post;
    } catch (err) {
      throw err;
    }
  }
  public async updatePost(id: string, body: object) {
    try {
      const post = await Post.findOneAndUpdate({ _id: id }, body);
      return post;
    } catch (err) {
      throw err;
    }
  }
  public async deletePost(id: string) {
    try {
      const post = await Post.findOneAndDelete({ _id: id });
    } catch (err) {
      throw err;
    }
  }
}
