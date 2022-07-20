import express from "express";
import UserRouter from "./users/user.route";
export default class CombineRoute {
  userRouter: express.Router = UserRouter;
}
