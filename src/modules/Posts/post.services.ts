import { Model } from "mongoose";
import Post, { IPost } from "../../common/models/post.model";
import Tag from "../../common/models/tag.model";
import { BaseRepository } from "../../common/repository/base.repository";
import AppError from "../../utils/appError";
import { ErrorMessages, ErrorResponsesCode } from "../../utils/constants";

export default class PostService extends BaseRepository<IPost> {
  constructor(public readonly userRepository: Model<IPost>) {
    super(userRepository);
  }

  async createPost(data: any): Promise<any> {
    try {
      const { tags } = data;

      let arrayTags = tags.split("#").splice(1);
      arrayTags = await Promise.all(
        arrayTags.map(async (ele: any) => {
          let tag = await Tag.findOne({ name: ele });
          if (tag) {
            await tag.increaseAmount();
          } else {
            tag = await Tag.create({ name: ele });
          }
          return tag._id;
        })
      );
      data.tags = arrayTags;
      return await this.create(data);
    } catch (err) {
      throw err;
    }
  }

  async getMyPosts(userId: string): Promise<any> {
    try {
      let filter = { user_id: userId, isDelete: false };
      const posts = await Post.find(filter)
        .populate("tags")
        .populate("category")
        // .populate("comments")
        .populate("user_id")
        .exec();
      return posts;
    } catch (err) {
      throw err;
    }
  }

  async getAllPosts(): Promise<any> {
    try {
      let filter: object = { isDelete: false };
      const posts = await Post.find(filter)
        .populate("tags")
        .populate("category")
        .populate("user_id")
        // .populate("comments")
        .exec();
      return posts;
    } catch (err) {
      throw err;
    }
  }

  async getFilterPosts(filter: any): Promise<any> {
    try {
      let { page, size, category, search, sortBy, orderBy } = filter;
      let _page = page ? parseInt(page) : 1;
      let _size = size ? parseInt(size) : 10;
      let posts, totalRows, finalFilter: object;
      const _sortBy: string = sortBy ? sortBy : "created_at";
      const _orderBy: number = orderBy ? parseInt(orderBy) : 1;
      const sorting: any = { [_sortBy]: _orderBy };
      if (search) {
        finalFilter = {
          isDelete: false,
          $text: { $search: `\"` + search + `\"` },
          category,
        };
      } else {
        finalFilter = {
          isDelete: false,
          category,
        };
      }
      Object.keys(finalFilter).forEach(
        (key) =>
          (<any>finalFilter)[key] === undefined &&
          delete (<any>finalFilter)[key]
      );
      posts = await Post.find(finalFilter)
        .populate("tags")
        .populate("category")
        // .populate("comments")
        .populate("user_id")
        .select({ isDelete: 0 })
        .limit(_size)
        .skip(_size * (_page - 1))
        .sort(sorting)
        .exec();

      totalRows = await Post.countDocuments(finalFilter).exec();
      if (!posts.length) {
        throw new AppError(ErrorResponsesCode.NOT_FOUND, "Posts not Exist");
      }
      return {
        data: posts,
        totalRows,
      };
    } catch (err) {
      throw err;
    }
  }

  async getPost(filter: any): Promise<any> {
    try {
      const post = Post.findOne(filter)
        .populate("tags")
        .populate("category")
        .populate("comments")
        .populate("user_id")
        .select({ isDelete: 0 })
        .exec();
      if (!post) {
        throw new AppError(ErrorResponsesCode.NOT_FOUND, "Post not Exist");
      }
      return post;
    } catch (err) {
      throw err;
    }
  }

  async updatePost(postId: string, user: any, data: any): Promise<any> {
    try {
      let filter: object = { _id: postId, isDelete: false };
      if (!user.isAmin) {
        filter = { _id: postId, user_id: user._id, isDelete: false };
      }
      const postOld = await Post.findOne(filter);
      if (!postOld) {
        throw new AppError(
          ErrorResponsesCode.BAD_REQUEST,
          ErrorMessages.BAD_REQUEST
        );
      }
      if (postOld?.tags.length) {
        await Promise.all(
          postOld.tags.map(async (ele: any) => {
            const tag = await Tag.findById(ele);
            await tag?.decreaseAmount();
          })
        );
      }
      const { tags } = data;
      if (tags) {
        let arrayTags = tags.split("#").splice(1);
        arrayTags = await Promise.all(
          arrayTags.map(async (ele: any) => {
            let tag = await Tag.findOne({ name: ele });
            if (tag) {
              tag.increaseAmount();
            } else {
              tag = await Tag.create({ name: ele });
            }
            return tag._id;
          })
        );
        data.tags = arrayTags;
      }
      const post = await Post.findByIdAndUpdate(postId, data, { new: true })
        .populate("tags")
        .populate("category")
        // .populate("comments")
        .populate("user_id")
        .exec();
      return post;
    } catch (err) {
      throw err;
    }
  }
  async deletePost(postId: string, user: any): Promise<any> {
    try {
      let filter: object = { _id: postId };
      if (!user.isAdmin) {
        filter = { _id: postId, user_id: user._id };
      }
      const post = await this.delete(filter);

      Promise.all(
        post.tags.map(async (ele: any) => {
          const tag = await Tag.findById(ele);
          await tag?.decreaseAmount();
        })
      );
    } catch (err) {
      throw err;
    }
  }
}
