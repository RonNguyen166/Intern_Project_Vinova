import { Router } from "express";
import { isAuthen, isAuthor } from "../../middlewares/authen.middleware";
import validate from "../../middlewares/validate.middleware";
import { create, getAll, getOne, updateOne, deleteOne } from "./branch.schema";
import BranchController from "./branch.controller";
export default class BranchRoute {
  public router: Router = Router();
  private branchController = new BranchController();
  constructor() {
    this.intializeRoute();
  }
  public intializeRoute(): void {
    this.router
      .route("/:id")
      .get(
        isAuthen, 
        validate(getOne), 
        this.branchController.getBranch)
      .patch(
        isAuthen, 
        isAuthor, 
        validate(updateOne), 
        this.branchController.updateBranch)
      .delete(
        isAuthen, 
        isAuthor, 
        validate(deleteOne), 
      this.branchController.deleteBranch)
    this.router
      .route("/")
      .get(
        isAuthen, 
        validate(getAll), 
      this.branchController.getAllBranchs)
      .post(
        isAuthen, 
        isAuthor, 
        validate(create), 
      this.branchController.createBranch);
  }
}
