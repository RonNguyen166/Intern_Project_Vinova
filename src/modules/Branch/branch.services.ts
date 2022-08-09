import { Model } from "mongoose";
import { IBranch } from "../../common/models/branch.model";
import { BaseRepository } from "../../common/repository/base.repository";
import AppError from "../../utils/appError";
import { ErrorResponsesCode } from "../../utils/constants";
export default class BranchService extends BaseRepository<IBranch> {
  constructor(public readonly branchRepository: Model<IBranch>) {
    super(branchRepository);
  }
  async getAllBranchs(): Promise<any> {
    try {
      const branchs = await this.getAll();
      if (!branchs) {
        throw new AppError(ErrorResponsesCode.NOT_FOUND, "Branch not Exist");
      }
      return branchs;
    } catch (err) {
      throw err;
    }
  }

  async getBranch(branchId: any): Promise<any> {
    try {
      const branch = await this.getOne({ _id: branchId });
      if (!branch) {
        throw new AppError(ErrorResponsesCode.NOT_FOUND, "Branch not Exist");
      }
      return branch;
    } catch (err) {
      throw err;
    }
  }

  async createBranch(data: any): Promise<any> {
    try {
      const branch = await this.create(data);
      return branch;
    } catch (err) {
      throw err;
    }
  }

  async updateBranch(branchId: any, data: object) {
    try {
      const branch = await this.update({ _id: branchId }, data);
      if (!branch) {
        throw new AppError(ErrorResponsesCode.NOT_FOUND, "Branches not Exist");
      }
      return branch;
    } catch (err) {
      throw err;
    }
  }
  async deleteBranch(branchId: any) {
    try {
      const branch = await this.delete({ _id: branchId });
      if (!branch) {
        throw new AppError(ErrorResponsesCode.NOT_FOUND, "Branch not Exist");
      }
      return branch;
    } catch (err) {
      throw err;
    }
  }
}
