import { Application } from "express";
import AuthRoute from "./Authentication/auth.route";
import UserRouter from "./User/user.route";
import BranchRoute from "./Branch/branch.route";
import CategoryRoute from "./Category/category.route";
import DocumentRoute from "./Document/document.route";
import ProductRouter from "./Products/product.route";
import RedemptionRouter from "./Redemptions/redemption.route";
import TagRouter from "./Tags/tag.route";
import AdminRoute from "./Admin/admin.route";
import CommentRoute from "./Comments/comment.route";
import PostRouter from "./Posts/post.route"
import TransactionRouter from "./Transactions/transaction.route";

export default class CombineRoute {
  private userRoute = new UserRouter();
  private authRoute = new AuthRoute();
  private documentRoute = new DocumentRoute();
  private branchRoute = new BranchRoute();
  private categoryRoute = new CategoryRoute();
  private adminRoute = new AdminRoute();
  private commentRoute = new CommentRoute();

  private productRoute = ProductRouter;
  private redemptionRoute = RedemptionRouter;
  private tagRoute = TagRouter;
  private transactionRoute = TransactionRouter;
  private postRoute = new PostRouter();

  public start(app: Application) {
    app.use("/v1/products", this.productRoute);
    app.use("/v1/redemptions", this.redemptionRoute);
    app.use("/v1/tags", this.tagRoute);
    app.use("/v1/transactions", this.transactionRoute);
    app.use("/v1/posts", this.postRoute.router);
    app.use("/v1/users", this.userRoute.router);
    app.use("/v1/auth", this.authRoute.router);
    app.use("/v1/documents", this.documentRoute.router);
    app.use("/v1/branches", this.branchRoute.router);
    app.use("/v1/categories", this.categoryRoute.router);
    app.use("/v1/admin", this.adminRoute.router);
    app.use("/v1/comments", this.commentRoute.router);
  }
}
