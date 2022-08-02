import express from "express";
import TransactionController from "./transaction.controller";
import {auth} from "../../middlewares/authen.middleware";

const transactionController = new TransactionController();
const router = express.Router();

router
  .route("/")
  .get(auth("User"), transactionController.getTransactionByUserId)
  .post(auth("User"), transactionController.createTransaction);
router.route("/top/receivers").get(transactionController.getTopReceivers);
router.route("/top/givers").get(transactionController.getTopGivers);
router
  .route("/:id")
  .get(auth("User"), transactionController.getTransaction);

export default router;
