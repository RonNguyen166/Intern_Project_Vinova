// import {Router} from "express";
// import TransactionController from "./transaction.controller";
// import validate from "../../middlewares/validate.middleware";
// import { create } from "./transaction.schema";
// import { isAuthen, isAuthor } from "../../middlewares/authen.middleware";

// export default class TransactionRoute {
//   public router: Router = Router();
//   private transactionController: TransactionController =
//     new TransactionController();
//   constructor() {
//     this.intializeRoute();
//   }
//   public intializeRoute() {
//     this.router
//       .post(
//         "/",
//         isAuthen,
//         isAuthor,
//         validate(create),
//         this.transactionController.createTransaction
//       )
//       .get(
//         "/",
//         isAuthen,
//         isAuthor,
//         this.transactionController.getTransactionByUserId
//       )
//       .get("/top/receivers", this.transactionController.getTopReceivers)
//       .get("/top/givers", this.transactionController.getTopGivers)
//       .get(
//         "/:id",
//         isAuthen,
//         isAuthor,
//         this.transactionController.getTransaction
//       );
//   }
// }
import express from "express";
import validate from "../../middlewares/validate.middleware";
import { create } from "./transaction.schema";
import TransactionController from "./transaction.controller";
import {isAuthen, isAuthor} from "../../middlewares/authen.middleware";

const transactionController = new TransactionController();
const router = express.Router();

router
  .route("/")
  .get(isAuthen, transactionController.getTransactionByUserId)
  .post(isAuthen, validate(create), transactionController.createTransaction);
router.route("/top/receivers").get(transactionController.getTopReceivers);
router.route("/top/givers").get(transactionController.getTopGivers);
router.route("/all").get(transactionController.getAllTransactions)
router
  .route("/:id")
  .get(isAuthen, transactionController.getTransaction);

export default router;