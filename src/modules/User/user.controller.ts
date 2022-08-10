import { Request, Response } from "express";
import UserService from "./user.services";
import { serializerUser, serializerGetUser } from "./user.serializer";
import { successReponse } from "../../common/services/response.service";
import User from "../../common/models/user.model";
import {
  IUserGet,
  IUserUpdate,
  IUserProfile,
  IUserCreate,
} from "./user.interface";
import catchAsync from "../../utils/catchAsync";
import S3Upload from "../../common/services/upload.service";
import AppError from "../../utils/appError";
import { ErrorResponsesCode } from "../../utils/constants";

export default class UserController {
  public userService: UserService = new UserService(User);
  public s3Upload: S3Upload = new S3Upload();

  public createUser = catchAsync(async (req: Request, res: Response) => {
    if (req.file?.mimetype.startsWith("image")) {
      const url = await this.s3Upload.put(req.file);
      req.body.photo = url;
    }
    const data: IUserCreate = req.body;
    const result = await this.userService.createUser(data);
    const resultData: object = {
      user: serializerUser(result),
    };
    return successReponse(req, res, resultData, "Create Successfully", 201);
  });

  public getAllUsers = catchAsync(async (req: Request, res: Response) => {
    const results = await this.userService.getAllUsers();
    const serializedResults = await Promise.all(
      results.map(async (ele: any) => {
        ele.photoUrl = await this.s3Upload.get(ele.photo);
        return serializerGetUser(ele);
      })
    );
    const resultData: object = {
      users: serializedResults,
    };
    return successReponse(req, res, resultData, "Get Successfully");
  });

  public getFilterUsers = catchAsync(async (req: Request, res: Response) => {
    const dataQuery: IUserGet = { ...req.query };
    const results = await this.userService.getFilterUser(dataQuery);
    const serializedResults = await Promise.all(
      results?.data.map(async (ele: any) => {
        ele.photoUrl = ele.photo && (await this.s3Upload.get(ele.photo));
        return serializerGetUser(ele);
      })
    );
    const resultData: object = {
      page: req.query.page ? parseInt(<string>req.query.page) : 1,
      size: req.query.size ? parseInt(<string>req.query.size) : 10,
      totalRows: results.totalRows,
      users: serializedResults,
    };
    return successReponse(req, res, resultData, "Get Successfully");
  });

  public getUser = catchAsync(async (req: Request, res: Response) => {
    const result = await this.userService.getUser({ _id: req.params.id });
    result.photoUrl = await this.s3Upload.get(result.photo);
    const resultData: object = {
      user: serializerGetUser(result),
    };
    return successReponse(req, res, resultData, "Get Succesfully");
  });

  public updateUser = catchAsync(async (req: Request, res: Response) => {
    if (req.file?.mimetype.startsWith("image")) {
      const url = await this.s3Upload.put(req.file);
      req.body.photo = url;
    }
    const dataBody: IUserUpdate = { ...req.body };

    const result = await this.userService.updateUser(req.params.id, dataBody);
    const resultData: object = {
      user: serializerUser(result),
    };
    return successReponse(req, res, resultData, "Updated Succesfully");
  });

  public editProfile = catchAsync(async (req: Request, res: Response) => {
    if (req.file) {
      if (req.file?.mimetype.startsWith("image")) {
        const url = await this.s3Upload.put(req.file);
        req.body.photo = url;
      } else {
        throw new AppError(
          ErrorResponsesCode.BAD_REQUEST,
          "File upload failed"
        );
      }
    }

    const dataBody: IUserProfile = { ...req.body };
    const result = await this.userService.editProfile(
      (<any>req).authenticatedUser._id,
      dataBody
    );
    const resultData: object = {
      user: serializerGetUser(result),
    };
    return successReponse(req, res, resultData, "Updated Succesfully");
  });

  public getProfile = catchAsync(async (req: Request, res: Response) => {
    const result = await this.userService.getUser({
      _id: (<any>req).authenticatedUser._id,
    });
    result.photoUrl = await this.s3Upload.get(result.photo);
    const resultData: object = {
      user: serializerGetUser(result),
    };
    return successReponse(req, res, resultData, "Get Succesfully");
  });

  public deleteUser = catchAsync(async (req: Request, res: Response) => {
    const user = await this.userService.deleteUser(req.params.id);
    await this.s3Upload.delete(user.photo);
    return successReponse(req, res, { isDelete: true }, "Deleted Succesfully");
  });
}
