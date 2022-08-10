import PostService from "./post.services";
import Post from "../../common/models/post.model";
import catchAsync from "../../utils/catchAsync";
import { successReponse } from "../../common/services/response.service";
import { Request, Response } from "express";
import { serializerGetPost, serializerPost } from "./post.serializer";
import { ICreatePost, IGetPost, IUpdatePost } from "./post.interface";

export default class PostController {
  private postService: PostService = new PostService(Post);

  public createPost = catchAsync(async (req: Request, res: Response) => {
    const data: ICreatePost = {
      user_id: (<any>req).authenticatedUser._id,
      ...req.body,
    };
    const result = await this.postService.createPost(data);
    const resultData: object = {
      post: serializerPost(result),
    };
    return successReponse(req, res, resultData, "Create Successfully", 201);
  });

  public getAllPosts = catchAsync(async (req: Request, res: Response) => {
    const results = await this.postService.getAllPosts();
    const serializedResults = await results.map((ele: any) =>
      serializerGetPost(ele)
    );
    const resultData: object = {
      posts: serializedResults,
    };
    return successReponse(req, res, resultData, "Create Successfully", 201);
  });

  public getFilterPosts = catchAsync(async (req: Request, res: Response) => {
    const query: IGetPost = { ...req.query };
    const results = await this.postService.getFilterPosts(query);
    const serializedResults = await results.data.map((ele: any) =>
      serializerGetPost(ele)
    );
    const resultData: object = {
      page: req.query.page ? parseInt(<string>req.query.page) : 1,
      size: req.query.size ? parseInt(<string>req.query.size) : 10,
      totalRows: results.totalRows,
      posts: serializedResults,
    };
    return successReponse(req, res, resultData, "Get Successfully");
  });

  public getMyPosts = catchAsync(async (req: Request, res: Response) => {
    const results = await this.postService.getMyPosts(
      (<any>req).authenticatedUser._id
    );
    const serializedResults = await results.map((ele: any) =>
      serializerGetPost(ele)
    );
    const resultData: object = {
      totalPosts: results.length,
      posts: serializedResults,
    };
    return successReponse(req, res, resultData, "Get Successfully", 201);
  });

  public getPost = catchAsync(async (req: Request, res: Response) => {
    const result = await this.postService.getPost(
      (<any>req).authenticatedUser,
      { _id: req.params.id, isDelete: false }
    );
    const resultData: object = {
      post: serializerGetPost(result),
    };
    return successReponse(req, res, resultData, "Get Successfully");
  });

  public updatePost = catchAsync(async (req: Request, res: Response) => {
    const data: IUpdatePost = { ...req.body };
    const result = await this.postService.updatePost(
      req.params.id,
      (<any>req).authenticatedUser,
      data
    );
    const resultData: object = {
      posts: serializerPost(result),
    };
    return successReponse(req, res, resultData, "Update Successfully");
  });

  public deletePost = catchAsync(async (req: Request, res: Response) => {
    await this.postService.deletePost(
      req.params.id,
      (<any>req).authenticatedUser
    );
    return successReponse(req, res, { isDelete: true }, "Delete Successfully");
  });

  // public toView = catchAsync(async (req: Request, res: Response) => {
  //   await this.postService.toView(req.params.id);
  //   return successReponse(req, res, undefined, "Successfully");
  // });

  public toFavorite = catchAsync(async (req: Request, res: Response) => {
    await this.postService.toFavorite(
      req.params.id,
      (<any>req).authenticatedUser
    );
    return successReponse(req, res, undefined, "Successfully");
  });
}
