import { Application } from "express";
import AuthRoute from "./Authentication/auth.route";
import UserRouter from "./User/user.route";
import BranchRoute from "./Branch/branch.route";
import CategoryRoute from "./Category/category.route";
import DocumentRoute from "./Category/category.route";

import ProductRouter from "./Products/product.route";
import RedemptionRouter from "./Redemptions/redemption.route";
import TagRouter from "./Tags/tag.route";
import TransactionRouter from "./Transactions/transaction.route";
import PostRouter from "./Posts/post.route";

export default class CombineRoute {
  private userRoute = new UserRouter();
  private authRoute = new AuthRoute();
  private documentRoute = new DocumentRoute();
  private branchRoute = new BranchRoute();
  private categoryRoute = new CategoryRoute();

  private productRoute = ProductRouter;
  private redemptionRoute = RedemptionRouter;
  private tagRoute = TagRouter;
  private transactionRoute = TransactionRouter;
  private postRoute = PostRouter;

  public start(app: Application) {
    app.use("/v1/products", this.productRoute);
    app.use("/v1/redemptions", this.redemptionRoute);
    app.use("/v1/tags", this.tagRoute);
    app.use("/v1/transactions", this.transactionRoute);
    app.use("/v1/posts", this.postRoute);
    app.use("/v1/users", this.userRoute.router);
    app.use("/v1/auth", this.authRoute.router);
    app.use("/v1", this.documentRoute.router);
    app.use("/v1", this.branchRoute.router);
    app.use("/v1", this.categoryRoute.router);
  }
}
