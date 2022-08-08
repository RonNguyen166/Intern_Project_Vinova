import { Router } from "express";
import validate from "../../middlewares/validate.middleware";
import { 
  create, 
  getAll, 
  getOne, 
  updateOne, 
  deleteOne 
} from "./document.schema";
import DocumentController from "./document.controller";
import { isAuthen, isAuthor } from "../../middlewares/authen.middleware";
import { upload } from "../../common/services/upload2.service";
export default class DocumentRoute {
  public router: Router = Router();
  private documentController = new DocumentController();
  constructor() {
    this.intializeRoute();
  }
  public intializeRoute(): void {
    this.router
      .route(`/:id`)
      .get( 
        validate(getOne), 
        this.documentController.getDocument)
      .patch(
        isAuthen, 
        isAuthor, 
        validate(updateOne), 
        upload.single("image"),
        upload.single("link"),
        this.documentController.updateDocument)
      .delete(
        isAuthen, 
        isAuthor, 
        validate(deleteOne), 
      this.documentController.deleteDocument)
    this.router
      .route(`/`)
      .get( 
        validate(getAll), 
        this.documentController.getAllDocuments)
      .post(
        isAuthen, 
        isAuthor, 
        upload.single("image"),
        upload.single("link"),
        validate(create), 
      this.documentController.createDocument);
  }
}
