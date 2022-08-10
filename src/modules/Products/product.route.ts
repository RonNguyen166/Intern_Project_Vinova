import express from "express";
import { isAuthen, isAuthor } from "../../middlewares/authen.middleware";
import ProductController from "./product.controller";
import RedemptionController from "../Redemptions/redemption.controller";
import { upload } from "../../common/services/upload2.service";
import validate from "../../middlewares/validate.middleware";
import JoiSchema from "./product.schema";

const productController = new ProductController();
const redemptionController = new RedemptionController();
const productSchema = new JoiSchema();
const router = express.Router();

/*
POST method for testing purposes only
*/
router
  .route("/")
  .get(productController.getAllProduct)
  .post(
    isAuthen,
    isAuthor,
    upload.single("photo"),
    validate(productSchema.createSchema),
    productController.createProduct
  );

/*
UPDATE method for testing purposes only
DELETE method for testing purposes only
*/
router.route("/top_redeem").get(redemptionController.getTopRedeem);
router
  .route("/:id")
  .get(productController.getProduct)
  .delete(isAuthen, isAuthor, productController.deleteProduct)
  .patch(
    isAuthen,
    isAuthor,
    validate(productSchema.updateSchema),
    productController.updateProduct
  );

router
  .route("/:id/redeem")
  .post(isAuthen, redemptionController.createRedemption);

export default router;
