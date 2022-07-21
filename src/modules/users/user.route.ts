import express from "express";
import UserController from "./../users/user.controller";
import UserJoiSchema from "./user.schema";
import CommonValidator from "./../../middlewares/validate.middleware";
import Authenticator from "./../../middlewares/authen.middleware";

const userController = new UserController();
const userJoiSchema = new UserJoiSchema();
const commonValidator = new CommonValidator();
const authenticator = new Authenticator();

const router: express.Router = express.Router();

router
  .route("/")
  .get(authenticator.protect, userController.getAllUsers)
  .post(
    commonValidator.validate(userJoiSchema.createSchema),
    userController.createUser
  );

router.route("/:id").get(userController.getUser);
router
  .route("/signup")
  .post(
    commonValidator.validate(userJoiSchema.createSchema),
    userController.signUp
  );

router.route("/login").post(userController.login);
export default router;
