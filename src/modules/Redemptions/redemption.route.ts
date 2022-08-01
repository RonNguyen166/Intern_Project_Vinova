/**
 * THIS ROUTE FOR TESTING PURPOSES ONLY
 */

import express from "express";
import RedemptionController from "./redemption.controller";
import {auth} from "../../middlewares/authen.middleware";

const redemptionController: RedemptionController = new RedemptionController();
const router = express.Router();

router
  .route("/")
  .get(auth("User"), redemptionController.getRedemptionsByUserId);

export default router;
