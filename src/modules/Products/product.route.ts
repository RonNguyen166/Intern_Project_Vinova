import express from "express";
import {isAuthen, isAuthor} from "../../middlewares/authen.middleware";
import ProductController from "./product.controller";
import RedemptionController from "../Redemptions/redemption.controller";
import {upload} from "../../common/services/upload2.service";

const productController = new ProductController();
const redemptionController = new RedemptionController();
const router = express.Router();

/*
POST method for testing purposes only
*/
router
  .route("/")
  .get(productController.getAllProduct)
  .post(isAuthen, upload.single("photo"), productController.createProduct);

/*
UPDATE method for testing purposes only
DELETE method for testing purposes only
*/
router.route('/top_redeem').get(redemptionController.getTopRedeem);
router
  .route("/:id")
  .get(productController.getProduct)
  .post(productController.deleteProduct)
  .patch(productController.updateProduct);

router
  .route("/:id/redeem")
  .post(isAuthen, redemptionController.createRedemption);

export default router;
