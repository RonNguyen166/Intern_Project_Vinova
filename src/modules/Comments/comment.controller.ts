import { Request, Response } from "express";
import CommentService from "./comment.services";
import { serializerComment, serializerGetComment } from "./comment.serializer";
import { successReponse } from "../../common/services/response.service";
import Comment from "../../common/models/comment.model";
import {
  ICommentCreate,
  ICommentGet,
  ICommentUpdate,
} from "./comment.interface";
import catchAsync from "../../utils/catchAsync";

export default class CommentController {
  public commentService: CommentService = new CommentService(Comment);

  public createCommentPost = catchAsync(async (req: Request, res: Response) => {
    const data: ICommentCreate = {
      user_id: (<any>req).authenticatedUser._id,
      ...req.body,
    };
    const result = await this.commentService.createCommentPost(data);
    const resultData: object = {
      comment: result,
    };
    return successReponse(req, res, resultData, "Create Successfully", 201);
  });

  public createCommentTransaction = catchAsync(
    async (req: Request, res: Response) => {
      const data: ICommentCreate = {
        user_id: (<any>req).authenticatedUser._id,
        ...req.body,
      };
      const result = await this.commentService.createCommentTransaction(data);
      const resultData: object = {
        comment: result,
      };
      return successReponse(req, res, resultData, "Create Successfully", 201);
    }
  );

  public getAllComments = catchAsync(async (req: Request, res: Response) => {
    const results = await this.commentService.getAllComments(req.query);
    const serializedResults = results.map((ele: any) =>
      ele.id ? serializerGetComment(ele) : serializerComment(ele)
    );
    const resultData: object = {
      comments: serializedResults,
    };
    return successReponse(req, res, resultData, "Get Successfully");
  });

  public getCommentsByPost = catchAsync(async (req: Request, res: Response) => {
    const limit: any = req.query.limit;
    const results = await this.commentService.getCommentsByPost(
      req.params.id,
      limit
    );
    const serializedResults = results.map((ele: any) =>
      serializerGetComment(ele)
    );
    const resultData: object = {
      totalComments: results.length,
      comments: serializedResults,
    };
    return successReponse(req, res, resultData, "Get Successfully");
  });

  public getCommentByPost = catchAsync(async (req: Request, res: Response) => {
    const result = await this.commentService.getCommentByPost({
      ...req.params,
    });
    const resultData: object = {
      comment: result,
    };
    return successReponse(req, res, resultData, "Get Successfully");
  });

  public getAllReplies = catchAsync(async (req: Request, res: Response) => {
    const results = await this.commentService.getAllReplies(
      req.params.parentId
    );
    const serializedResults = results.map((ele: any) =>
      ele.id ? serializerGetComment(ele) : serializerComment(ele)
    );
    const resultData: object = {
      comments: serializedResults,
    };
    return successReponse(req, res, resultData, "Get Successfully");
  });

  public createCommentReply = catchAsync(
    async (req: Request, res: Response) => {
      const data: ICommentCreate = {
        user_id: (<any>req).authenticatedUser._id,
        ...req.body,
      };
      const result = await this.commentService.createCommentReply(data);
      const resultData: object = {
        comment: result,
      };
      return successReponse(req, res, resultData, "Create Successfully", 201);
    }
  );
  public getComment = catchAsync(async (req: Request, res: Response) => {
    const filter: object = {
      _id: req.params.id,
      isDelete: false,
    };
    const result = await this.commentService.getComment(filter);
    const resultData: object = {
      comment: serializerGetComment(result),
    };
    return successReponse(req, res, resultData, "Get Succesfully");
  });

  public updateComment = catchAsync(async (req: Request, res: Response) => {
    const dataBody: ICommentUpdate = { ...req.body };

    const result = await this.commentService.updateComment(
      (<any>req).authenticatedUser,
      req.params,
      dataBody
    );
    const resultData: object = {
      comment: serializerGetComment(result),
    };
    return successReponse(req, res, resultData, "Updated Succesfully");
  });
  public getReply = catchAsync(async (req: Request, res: Response) => {
    const result = await this.commentService.getReply(req.params);
    const resultData: object = {
      comment: serializerGetComment(result),
    };
    return successReponse(req, res, resultData, "Get Succesfully");
  });
  public updateReply = catchAsync(async (req: Request, res: Response) => {
    const dataBody: ICommentUpdate = { ...req.body };
    const result = await this.commentService.updateReply(
      (<any>req).authenticatedUser,
      req.params,
      dataBody
    );
    const resultData: object = {
      comment: serializerGetComment(result),
    };
    return successReponse(req, res, resultData, "Updated Succesfully");
  });
  public deleteCommentPost = catchAsync(async (req: Request, res: Response) => {
    await this.commentService.deleteCommentPost(
      (<any>req).authenticatedUser,
      req.params
    );
    return successReponse(req, res, { isDelete: true }, "Deleted Succesfully");
  });

  public deleteCommentTransaction = catchAsync(
    async (req: Request, res: Response) => {
      await this.commentService.deleteCommentTransaction(
        (<any>req).authenticatedUser,
        req.params
      );
      return successReponse(
        req,
        res,
        { isDelete: true },
        "Deleted Succesfully"
      );
    }
  );
  public deleteReply = catchAsync(async (req: Request, res: Response) => {
    await this.commentService.deleteReply(
      (<any>req).authenticatedUser,
      req.params
    );
    return successReponse(req, res, { isDelete: true }, "Deleted Succesfully");
  });
}
