import { Request, Response } from "express";
import BranchService from "./branch.services";
import { serializerBranch, serializerGetBranch } from "./branch.serializer";
import { successReponse } from "../../common/services/response.sevice";
import Branch from "../../common/models/branch.model";
import { IBranchGet, IBranchUpdate } from "./branch.interface";
import catchAsync from "../../utils/catchAsync";
import { any } from "joi";

export default class BranchController {
  public branchService: BranchService = new BranchService(Branch)

  public createBranch = catchAsync(async (req: Request, res: Response) => {
    const result = await this.branchService.createBranch(req.body);
    const resultData: object = {
      branch: serializerGetBranch(result),
    };
    return successReponse(req, res, resultData, "Create Successfully", 201);
  });

  public getAllBranchs = catchAsync(async (req: Request, res: Response) => {
    const results = await this.branchService.getAllBranchs();
    const serializedResults = results.map((ele: any) =>
      ele.id ? serializerGetBranch(ele) : serializerBranch(ele)
    );
    const resultData: object = {
      branchs: serializedResults,
    };
    return successReponse(req, res, resultData, "Get Successfully");
  });


  public getBranch = catchAsync(async (req: Request, res: Response) => {
    const filter: object = {
      _id: req.params.id,
      isDelete: false,
    };
    const result = await this.branchService.getBranch(filter);
    const resultData: object = {
      branch: serializerGetBranch(result),
    };
    return successReponse(req, res, resultData, "Get Succesfully");
  });

  public updateBranch = catchAsync(async (req: Request, res: Response) => {
    const filter: object = {
      _id: req.params.id,
      isDelete: false,
    };
    const dataBody: IBranchUpdate = { ...req.body };
    const result = await this.branchService.updateBranch(filter, dataBody);
    const resultData: object = {
      branch: serializerGetBranch(result),
    };
    return successReponse(req, res, resultData, "Updated Succesfully");
  });

  public deleteBranch = catchAsync(async (req: Request, res: Response) => {
    const filter: object = {
      _id: req.params.id,
      isDelete: false,
    };
    await this.branchService.deleteBranch(filter);
    return successReponse(req, res, { isDelete: true }, "Updated Succesfully");
  });
}
