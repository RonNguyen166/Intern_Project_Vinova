import { Router } from "express";
import validate from "../../middlewares/validate.middleware";
import {
  create,
  getAll,
  getOne,
  updateOne,
  deleteOne,
  editProfile,
} from "./user.schema";
import UserController from "./user.controller";
import { isAuthen, isAuthor } from "../../middlewares/authen.middleware";
import { upload } from "../../common/services/upload.service";
export default class UserRoute {
  public router: Router = Router();
  private userController = new UserController();
  constructor() {
    this.intializeRoute();
  }
  public intializeRoute(): void {
    this.router.patch(
      "/edit-profile",
      upload.single("photo"),
      isAuthen,
      validate(editProfile),
      this.userController.editProfile
    );

    this.router.get("/filter", this.userController.getFilterUsers);
    this.router
      .route("/:id")
      .get(validate(getOne), this.userController.getUser)
      .patch(
        isAuthen,
        isAuthor,
        upload.single("photo"),
        validate(updateOne),
        this.userController.updateUser
      )
      .delete(
        isAuthen,
        isAuthor,
        validate(deleteOne),
        this.userController.deleteUser
      );

    this.router
      .route("/")
      .get(validate(getAll), this.userController.getAllUsers)
      .post(
        isAuthen,
        isAuthor,
        upload.single("photo"),
        validate(create),
        this.userController.createUser
      );
  }
}
