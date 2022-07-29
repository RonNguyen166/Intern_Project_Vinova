import { Request, Response } from "express";
import UserService from "./user.services";
import { serializerUser, serializerGetUser } from "./user.serializer";
import { successReponse } from "../../common/services/response.sevice";
import User from "../../common/models/user.model";
import { IUpdatePassword, IUserGet, IUserUpdate } from "./user.interface";
import catchAsync from "../../utils/catchAsync";

export default class UserController {
  public userService: UserService = new UserService(User);

  public createUser = catchAsync(async (req: Request, res: Response) => {
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
    const dataBody: IUserUpdate = { ...req.body };

    const result = await this.userService.updateUser(
      { _id: req.params.id },
      dataBody
    );
    const resultData: object = {
      user: serializerGetUser(result),
    };
    return successReponse(req, res, resultData, "Updated Succesfully");
  });

  public deleteUser = catchAsync(async (req: Request, res: Response) => {
    await this.userService.deleteUser({ _id: req.params.id });
    return successReponse(req, res, { isDelete: true }, "Updated Succesfully");
  });

  public updatePassword = catchAsync(async (req: Request, res: Response) => {
    const data: IUpdatePassword = req.body;
    const result = this.userService.updatePassword((<any>req).user, data);
    const resultData: object = {
      user: serializerGetUser(result),
    };
    return successReponse(req, res, resultData, "Updated Succesfully");
  });
}
