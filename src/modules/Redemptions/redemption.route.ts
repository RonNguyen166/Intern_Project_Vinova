/**
 * THIS ROUTE FOR TESTING PURPOSES ONLY
 */

import express from "express";
import RedemptionController from "./redemption.controller";
import {isAuthen, isAuthor} from "../../middlewares/authen.middleware";

const redemptionController: RedemptionController = new RedemptionController();
const router = express.Router();

router
  .route("/")
  .get(isAuthen, redemptionController.getRedemptionsByUserId);

//router.get("/all", redemption)

export default router;
