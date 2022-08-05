import { Router } from "express";
import CategoryController from "../Category/category.controller";
import DocumentController from "../Document/document.controller";
import PostController from "../Posts/post.controller";
import ProductController from "../Products/product.controller";
import UserController from "../User/user.controller";
import RedeemptionController from "../Redemptions/redemption.controller";
import { isAuthen, isAuthor } from "../../middlewares/authen.middleware";
import validate from "../../middlewares/validate.middleware";
import * as userValidation from "../../modules/User/user.schema";
import productValidation from "../../modules/Products/product.schema";
import * as categoryValidation from "../../modules/Category/category.schema";
import * as documentValidation from "../../modules/Document/document.schema";
import { upload } from "../../common/services/upload2.service";

export default class AdminRoute {
  public router: Router = Router();
  public userController = new UserController();
  // public productController = new ProductController();
  public postController = new PostController();
  // public categoryController = new CategoryController();
  // public documentController = new DocumentController();
  // public redeemptionController = new RedeemptionController();

  constructor() {
    this.initializeRoute();
  }
  async initializeRoute() {
    this.router.use(isAuthen, isAuthor);

    this.router
      .route("/users")
      .post(validate(userValidation.create), this.userController.createUser)
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
    this.router.route("/posts").get();
    // this.router
    //   .route("/products")
    //   .get(this.productController.getAllProduct)
    //   .post(
    //     validate(new productValidation().createSchema),
    //     this.productController.createProduct
    //   );

    // this.router
    //   .route("/products/:id")
    //   .get(this.productController.getProduct)
    //   .patch(
    //     validate(new productValidation().createSchema),
    //     this.productController.updateProduct
    //   )
    //   .delete(this.productController.deleteProduct);

    // this.router
    //   .route("/posts")
    //   .get(this.postController.getAllPost)
    //   .post(this.postController.createPost);

    // this.router
    //   .route("/categories")
    //   .get(
    //     validate(categoryValidation.getAll),
    //     this.categoryController.getAllCategorys
    //   )
    //   .post(
    //     validate(categoryValidation.create),
    //     this.categoryController.createCategory
    //   );

    // this.router
    //   .route("/categories/:id")
    //   .get(
    //     validate(categoryValidation.getOne),
    //     this.categoryController.getCategory
    //   )
    //   .patch(
    //     validate(categoryValidation.updateOne),
    //     this.categoryController.updateCategory
    //   )
    //   .delete(
    //     validate(categoryValidation.deleteOne),
    //     this.categoryController.deleteCategory
    //   );

    // this.router
    //   .route("/documents")
    //   .get(
    //     validate(documentValidation.getAll),
    //     this.documentController.getAllDocuments
    //   )
    //   .post(
    //     validate(documentValidation.create),
    //     this.documentController.createDocument
    //   );

    // this.router
    //   .route("/documents/:id")
    //   .get(
    //     validate(documentValidation.getOne),
    //     this.documentController.getDocument
    //   )
    //   .patch(
    //     validate(documentValidation.updateOne),
    //     this.documentController.updateDocument
    //   )
    //   .delete(
    //     validate(documentValidation.deleteOne),
    //     this.documentController.deleteDocument
    //   );

    // this.router
    //   .route("/redeemptions")
    //   .get(this.redeemptionController.getAllRedemptions);
  }
}
