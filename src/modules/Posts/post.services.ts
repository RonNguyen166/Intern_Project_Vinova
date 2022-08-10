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
      let arrayTags = tags.split(" ");
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
        .populate("tags", "name")
        .populate("category", "name")
        .populate("user_id", "fullName email photo")
        .populate("favorites", "fullName email photo")
        .populate("comments", "content user_id parent_id reply replies")
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
        .populate("tags", "name")
        .populate("category", "name")
        .populate("user_id", "fullName email photo")
        .populate("favorites", "fullName email photo")
        .populate({
          path: "comments",
          select: "-isDelete -__v",
          options: { sort: { created_at: 1 } },
        })
        .sort({ created_at: -1 })
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
      const _orderBy: number = orderBy ? parseInt(orderBy) : -1;
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
        .populate("tags", "name")
        .populate("category", "name")
        .populate("user_id", "fullName email photo")
        .populate("favorites", "fullName email photo")
        .populate({
          path: "comments",
          select: "-isDelete -__v",
          options: { sort: { created_at: 1 } },
        })
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

  async getPost(user: any, filter: any): Promise<any> {
    try {
      const post = await Post.findOne(filter)
        .populate("tags", "name")
        .populate("category", "name")
        .populate("user_id", "fullName email photo")
        .populate("favorites", "fullName email photo")
        .populate({
          path: "comments",
          select: "-isDelete -__v",
          options: { sort: { created_at: 1 } },
        })
        .select({ isDelete: 0 })
        .exec();
      if (!post) {
        throw new AppError(ErrorResponsesCode.NOT_FOUND, "Post not Exist");
      } else {
        const isAccess = (<any>post).user_id.equals(user._id) || user.isAdmin;
        if (!isAccess) {
          await (<any>post).toView();
        }
      }
      return post;
    } catch (err) {
      throw err;
    }
  }

  async updatePost(postId: string, user: any, data: any): Promise<any> {
    try {
      // let filter: object = { _id: postId, isDelete: false };
      // if (!user.isAmin) {
      //   filter = { _id: postId, user_id: user._id, isDelete: false };
      // }
      let postOld = await Post.findOne({ _id: postId });
      if (!postOld) {
        throw new AppError(
          ErrorResponsesCode.BAD_REQUEST,
          ErrorMessages.BAD_REQUEST
        );
      } else {
        const isAccess =
          (<any>postOld).user_id.equals(user._id) || user.isAdmin;
        if (isAccess) {
          if (postOld.tags.length) {
            await Promise.all(
              postOld.tags.map(async (ele: any) => {
                const tag = await Tag.findById(ele);
                await tag?.decreaseAmount();
              })
            );
          }
          const { tags } = data;
          if (tags) {
            let arrayTags = tags.split(" ");
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
            .populate("tags", "name")
            .populate("category", "name")
            .populate("user_id", "fullName email photo")
            .populate("favorites", "fullName email photo")
            .populate({
              path: "comments",
              select: "-isDelete -__v",
              options: { sort: { created_at: 1 } },
            })
            .exec();
          return post;
        } else {
          throw new AppError(
            ErrorResponsesCode.BAD_REQUEST,
            "You do not have permission to perform this feature."
          );
        }
      }
    } catch (err) {
      throw err;
    }
  }
  async deletePost(postId: string, user: any): Promise<any> {
    try {
      const post = await this.getOne({ _id: postId });
      if (!post) {
        throw new AppError(
          ErrorResponsesCode.BAD_REQUEST,
          ErrorMessages.BAD_REQUEST
        );
      } else {
        const isAccess = (<any>post).user_id.equals(user._id) || user.isAdmin;
        if (isAccess) {
          await Promise.all(
            post.tags.map(async (ele: any) => {
              const tag = await Tag.findById(ele);
              await tag?.decreaseAmount();
            })
          );
          post.isDelete = true;
          await post.save();
        } else {
          throw new AppError(
            ErrorResponsesCode.BAD_REQUEST,
            "You do not have permission to perform this feature."
          );
        }
      }
    } catch (err) {
      throw err;
    }
  }

  async toFavorite(postId: string, user: any): Promise<any> {
    try {
      if (!user) {
        throw new AppError(ErrorResponsesCode.BAD_REQUEST, "Please login");
      }
      const post = await this.getOne({ _id: postId });
      if (!post)
        throw new AppError(ErrorResponsesCode.NOT_FOUND, "Post not found");

      const check = post.favorites.findIndex((userId: any) =>
        userId.equals(user._id)
      );
      if (check != -1) {
        post.favorites.splice(check, 1);
      } else {
        post.favorites.push(user._id);
      }
      await post.save();
    } catch (err) {
      throw err;
    }
  }

  // async toView(postId: string): Promise<any> {
  //   try {
  //     const post = await this.getOne({ _id: postId });
  //     if (!post) {
  //       throw new AppError(ErrorResponsesCode.NOT_FOUND, "Post not found");
  //     }
  //     await post.toView();
  //   } catch (err) {
  //     throw err;
  //   }
  // }
}
