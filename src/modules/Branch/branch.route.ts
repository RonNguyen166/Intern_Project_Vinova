import express, { Application, RequestHandler, Router } from "express";
import validate from "../../middlewares/validate.middleware";
import { create, getAll, getOne, updateOne, deleteOne } from "./branch.schema";
import BranchController from "./branch.controller";
export default class BranchRoute {
  public path: string = "/branches";
  public router: Router = Router();
  private branchController = new BranchController();
  constructor() {
    this.intializeRoute();
  }
  public intializeRoute(): void {
    this.router
      .route(`${this.path}/:id`)
      .get(validate(getOne), this.branchController.getBranch)
      .patch(validate(updateOne), this.branchController.updateBranch)
      .delete(validate(deleteOne), this.branchController.deleteBranch)
    this.router
      .route(`${this.path}/`)
      .get(validate(getAll), this.branchController.getAllBranchs)
      .post(validate(create), this.branchController.createBranch);
  }
}
