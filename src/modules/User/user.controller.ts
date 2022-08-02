import { Request, Response } from "express";
import UserService from "./user.services";
import { serializerUser, serializerGetUser } from "./user.serializer";
import { successReponse } from "../../common/services/response.service";
import User from "../../common/models/user.model";
import { IUserGet, IUserUpdate, IUserProfile } from "./user.interface";
import catchAsync from "../../utils/catchAsync";
import { s3DeleteUpload, s3Upload } from "../../common/services/upload.service";

export default class UserController {
  public userService: UserService = new UserService(User);

  public createUser = catchAsync(async (req: Request, res: Response) => {
    const url = await s3Upload(req.file);
    req.body.photo = url;
    const result = await this.userService.createUser(req.body);
    const resultData: object = {
      user: serializerGetUser(result),
    };
    return successReponse(req, res, resultData, "Create Successfully", 201);
  });

  public getAllUsers = catchAsync(async (req: Request, res: Response) => {
    const results = await this.userService.getAllUsers();

    const serializedResults = results.map((ele: any) =>
      ele.id ? serializerGetUser(ele) : serializerUser(ele)
    );
    const resultData: object = {
      users: serializedResults,
    };
    return successReponse(req, res, resultData, "Get Successfully");
  });

  public getFilterUsers = catchAsync(async (req: Request, res: Response) => {
    const dataQuery: IUserGet = { ...req.query };
    const results = await this.userService.getFilterUser(dataQuery);
    const serializedResults = results?.data.map((ele: any) =>
      ele.id ? serializerGetUser(ele) : serializerUser(ele)
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
    const resultData: object = {
      user: serializerGetUser(result),
    };
    return successReponse(req, res, resultData, "Get Succesfully");
  });

  public updateUser = catchAsync(async (req: Request, res: Response) => {
    if (req.file) {
      const url = await s3Upload(req.file);
      req.body.photo = url;
    }
    const dataBody: IUserUpdate = { ...req.body };

    const result = await this.userService.updateUser(req.params.id, dataBody);
    const resultData: object = {
      user: serializerGetUser(result),
    };
    return successReponse(req, res, resultData, "Updated Succesfully");
  });

  public editProfile = catchAsync(async (req: Request, res: Response) => {
    const url = await s3Upload(req.file);
    if (req.file) req.body.photo = url;
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

  public deleteUser = catchAsync(async (req: Request, res: Response) => {
    const user = await this.userService.deleteUser(req.params.id);
    await s3DeleteUpload(user.photo);
    return successReponse(req, res, { isDelete: true }, "Deleted Succesfully");
  });
}
