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
import { auth } from "../../middlewares/authen.middleware";
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
      auth(),
      validate(editProfile),
      this.userController.editProfile
    );

    this.router.get("/filter", this.userController.getFilterUsers);
    this.router
      .route("/:id")
      .get(validate(getOne), this.userController.getUser)
      .patch(
        auth("admin"),
        upload.single("photo"),
        validate(updateOne),
        this.userController.updateUser
      )
      .delete(
        auth("admin"),
        validate(deleteOne),
        this.userController.deleteUser
      );

    this.router
      .route("/")
      .get(validate(getAll), this.userController.getAllUsers)
      .post(
        auth("admin"),
        upload.single("photo"),
        validate(create),
        this.userController.createUser
      );
  }
}
