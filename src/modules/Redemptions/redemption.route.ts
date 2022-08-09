/**
 * THIS ROUTE FOR TESTING PURPOSES ONLY
 */

import express from "express";
import RedemptionController from "./redemption.controller";
import {isAuthen, isAuthor} from "../../middlewares/authen.middleware";

const redemptionController: RedemptionController = new RedemptionController();
const router = express.Router();

router
  .route("/my-redeem")
  .get(isAuthen, redemptionController.getRedemptionsByUserId);

router.route("/").get(redemptionController.getAllRedemptions);

export default router;
