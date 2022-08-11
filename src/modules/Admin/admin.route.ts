import { Router } from "express";
import CategoryController from "../Category/category.controller";
import DocumentController from "../Document/document.controller";
import PostController from "../Posts/post.controller";
import ProductController from "../Products/product.controller";
import UserController from "../User/user.controller";
import RedeemptionController from "../Redemptions/redemption.controller";
import BranchController from "../Branch/branch.controller";
import TagController from "../Tags/tag.controller";
import TransactionController from "../Transactions/transaction.controller";
import { isAuthen, isAuthor } from "../../middlewares/authen.middleware";
import validate from "../../middlewares/validate.middleware";
import * as userValidation from "../User/user.schema";
import productValidation from "../Products/product.schema";
import * as categoryValidation from "../Category/category.schema";
import * as documentValidation from "../Document/document.schema";
import * as postValidation from "../Posts/post.schema";
import * as branchValidation from "../Branch/branch.schema";
import * as tagValidation from "../Tags/tag.schema";
import { upload } from "../../common/services/upload2.service";

export default class AdminRoute {
  public router: Router = Router();
  public userController = new UserController();
  public productController = new ProductController();
  public postController = new PostController();
  public categoryController = new CategoryController();
  public documentController = new DocumentController();
  public redeemptionController = new RedeemptionController();
  public branchController = new BranchController();
  public tagController = new TagController();
  public transactionController = new TransactionController();

  constructor() {
    this.initializeRoute();
  }
  async initializeRoute() {
    this.router.use(isAuthen, isAuthor);

    this.router
      .route("/users")
      .post(
        upload.single("photo"),
        validate(userValidation.create),
        this.userController.createUser
      )
      .get(validate(userValidation.getAll), this.userController.getAllUsers);

    this.router
      .route("/users/:id")
      .get(validate(userValidation.getOne), this.userController.getUser)
      .patch(
        upload.single("photo"),
        validate(userValidation.updateOne),
        this.userController.updateUser
      )
      .delete(
        validate(userValidation.deleteOne),
        this.userController.createUser
      );

    this.router
      .route("/products")
      .get(this.productController.getAllProduct)
      .post(
        upload.single("photo"),
        validate(new productValidation().createSchema),
        this.productController.createProduct
      );

    this.router
      .route("/products/:id")
      .get(this.productController.getProduct)
      .patch(
        upload.single("photo"),
        validate(new productValidation().createSchema),
        this.productController.updateProduct
      )
      .delete(this.productController.deleteProduct);

    this.router
      .route("/posts")
      .get(this.postController.getAllPosts)
      .post(validate(postValidation.create), this.postController.createPost);

    this.router
      .route("/products/:id")
      .get(validate(postValidation.paramId), this.postController.getPost)
      .patch(validate(postValidation.paramId), this.postController.updatePost)
      .delete(validate(postValidation.paramId), this.postController.deletePost);

    this.router
      .route("/categories")
      .get(
        validate(categoryValidation.getAll),
        this.categoryController.getAllCategorys
      )
      .post(
        validate(categoryValidation.create),
        this.categoryController.createCategory
      );

    this.router
      .route("/categories/:id")
      .get(
        validate(categoryValidation.getOne),
        this.categoryController.getCategory
      )
      .patch(
        validate(categoryValidation.updateOne),
        this.categoryController.updateCategory
      )
      .delete(
        validate(categoryValidation.deleteOne),
        this.categoryController.deleteCategory
      );

    this.router
      .route("/documents")
      .get(
        validate(documentValidation.getAll),
        this.documentController.getAllDocuments
      )
      .post(
        upload.fields([
          { name: "link", maxCount: 1 },
          { name: "image", maxCount: 1 },
        ]),
        validate(documentValidation.create),
        this.documentController.createDocument
      );

    this.router
      .route("/documents/:id")
      .get(
        validate(documentValidation.getOne),
        this.documentController.getDocument
      )
      .patch(
        upload.fields([
          { name: "link", maxCount: 1 },
          { name: "image", maxCount: 1 },
        ]),
        validate(documentValidation.updateOne),
        this.documentController.updateDocument
      )
      .delete(
        validate(documentValidation.deleteOne),
        this.documentController.deleteDocument
      );

    this.router
      .route("/branches")
      .get(
        validate(branchValidation.getAll),
        this.branchController.getAllBranchs
      )
      .post(
        validate(branchValidation.create),
        this.branchController.createBranch
      );

    this.router
      .route("/branches/:id")
      .get(validate(branchValidation.getOne), this.branchController.getBranch)
      .patch(
        validate(branchValidation.updateOne),
        this.branchController.updateBranch
      )
      .delete(
        validate(branchValidation.deleteOne),
        this.branchController.deleteBranch
      );

    this.router
      .route("/tags")
      .get(this.tagController.getAllTags)
      .post(validate(tagValidation.create), this.tagController.createTag);

    this.router.get("/tags/trending", this.tagController.getTrendingTag);
    // this.router
    //   .route("/tags/:id")
    //   // .get(this.tagController.)
    //   .patch(this.tagController)
    //   .delete(this.tagController.deleteBranch);

    this.router
      .route("/redeemptions")
      .get(this.redeemptionController.getAllRedemptions);

    this.router
      .route("/transactions")
      .get(this.transactionController.getAllTransactions)
      .post(this.transactionController.createTransaction);

    this.router.get(
      "/transactions/posts",
      this.transactionController.getTransactionsTypeGive
    );

    this.router.get(
      "/transactions/:id",
      this.transactionController.getTransaction
    );

    this.router.get(
      "/transactions/top/receivers",
      this.transactionController.getTopReceivers
    );
    this.router.get(
      "/transactions/top/givers",
      this.transactionController.getTopGivers
    );
  }
}
