import express from "express";
import {auth} from "../../middlewares/authen.middleware";
import ProductController from "./product.controller";
import RedemptionController from "../Redemptions/redemption.controller";

const productController = new ProductController();
const redemptionController = new RedemptionController();
const router = express.Router();

/*
POST method for testing purposes only
*/
router
  .route("/")
  .get(productController.getAllProduct)
  .post(auth("User"), productController.createProduct);

/*
UPDATE method for testing purposes only
DELETE method for testing purposes only
*/
router
  .route("/:id")
  .get(productController.getProduct)
  .post(productController.deleteProduct)
  .patch(productController.updateProduct);

router
  .route("/:id/redeem")
  .post(auth("User"), redemptionController.createRedemption);

router.route('/redemptions/top_redeem').get(redemptionController.getTopRedeem);
export default router;
