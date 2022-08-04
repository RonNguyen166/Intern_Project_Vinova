import { Request, Response } from "express";
import CommentService from "./comment.services";
import {
  serializerComment,
  serializerGetComment,
} from "./comment.serializer";
import { successReponse } from "../../common/services/response.service";
import Comment from "../../common/models/comment.model";
import { ICommentGet, ICommentUpdate } from "./comment.interface";
import catchAsync from "../../utils/catchAsync";
import { any } from "joi";

export default class CommentController {
  public commentService: CommentService = new CommentService(Comment);

  public createComment = catchAsync(async (req: Request, res: Response) => {
    const result = await this.commentService.createComment(req.body);
    const resultData: object = {
      comment: serializerGetComment(result),
    };
    return successReponse(req, res, resultData, "Create Successfully", 201);
  });

  public getAllComments = catchAsync(async (req: Request, res: Response) => {
    const results = await this.commentService.getAllComments(req.query)
    const serializedResults = results.map((ele: any) =>
      ele.id ? serializerGetComment(ele) : serializerComment(ele)
    );
    const resultData: object = {
      comments: serializedResults,
    };
    return successReponse(req, res, resultData, "Get Successfully");
  });

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
    const filter: object = {
      _id: req.params.id,
      isDelete: false,
    };
    const dataBody: ICommentUpdate = { ...req.body };
    const result = await this.commentService.updateComment(filter, dataBody);
    const resultData: object = {
      comment: serializerGetComment(result),
    };
    return successReponse(req, res, resultData, "Updated Succesfully");
  });

  public deleteComment = catchAsync(async (req: Request, res: Response) => {
    const filter: object = {
      _id: req.params.id,
      isDelete: false,
    };
    await this.commentService.deleteComment(filter);
    return successReponse(req, res, { isDelete: true }, "Updated Succesfully");
  });
}
