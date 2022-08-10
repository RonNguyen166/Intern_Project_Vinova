import { Request, Response } from "express";
import DocumentService from "./document.services";
import {
  serializerDocument,
  serializerGetDocument 
} from "./document.serializer";
import { successReponse } from "../../common/services/response.service";
import Document from "../../common/models/document.model";
import {
  IDocumentCreate, 
  IDocumentGet, 
  IDocumentUpdate 
} from "./document.interface";
import catchAsync from "../../utils/catchAsync";
import S3Upload from "../../common/services/upload.service";
import AppError from "../../utils/appError";

export default class DocumentController {
  public documentService: DocumentService = new DocumentService(Document);
  public s3Upload: S3Upload = new S3Upload();

// create Document
  public createDocument = catchAsync(async (req: Request, res: Response) => {
    if (req.files) {
      if((<any>req).files.image[0].mimetype.startsWith("image")){
        const url = await this.s3Upload.put((<any>req).files.image[0]);
        req.body.image = url;

      }if((<any>req).files.link[0].mimetype === "application/pdf"){
        const url = await this.s3Upload.put((<any>req).files.link[0]);
        req.body.link = url;
      }
      else{
        throw new AppError(400, "Update Fail")
      }   
    }
    const data: IDocumentCreate = req.body;
    const result = await this.documentService.createDocument(data);
    
    const resultData: object = {
      document: serializerGetDocument(result),
    };
    return successReponse(req, res, undefined, "Create Successfully", 201);
  });

// Show ALL Documents
  public getAllDocuments = catchAsync(async (req: Request, res: Response) => {
    const results = await this.documentService.getAllDocuments();

    const serializedResults = results.map((ele: any) => serializerGetDocument(ele));
    const resultData: object = {
      documents: serializedResults,
    };
    return successReponse(req, res, resultData, "Get Successfully");
  });
// get document
  public getDocument = catchAsync(async (req: Request, res: Response) => {
    const result = await this.documentService.getDocument({ _id: req.params.id });
    result.imageUrl = await this.s3Upload.get(result.image);
    result.linkUrl = await this.s3Upload.get(result.link)
    const resultData: object = {
      document: serializerGetDocument(result),
    };
    return successReponse(req, res, resultData, "Get Succesfully");
  });

// update Document
  public updateDocument = catchAsync(async (req: Request, res: Response) => {
    if (req.files) {
      // if((<any>req).files?.image[0].mimetype.startsWith("image")){
      //   const url = await this.s3Upload.put((<any>req).files.image[0]);
      //   req.body.image = url;

      // }if((<any>req).files?.link[0].mimetype === "application/pdf"){
      //   const url = await this.s3Upload.put((<any>req).files.link[0]);
      //   req.body.link = url;
      // }
      // else{
      //   throw new AppError(400, "Update Fail")
      // }   

      if((<any>req).files.link){
        if((<any>req).files?.link[0].mimetype === "application/pdf"){
          const url = await this.s3Upload.put((<any>req).files.link[0]);
          req.body.link = url;
        }
      }else if((<any>req).files.image){
        if((<any>req).files?.image[0].mimetype.startsWith("image")){
          const url = await this.s3Upload.put((<any>req).files.image[0]);
          req.body.image = url;
        }
      }
    }
      const data: IDocumentCreate = req.body;
      const result = await this.documentService.updateDocument(req.params.id, data);
    
      const resultData: object = {
        document: serializerGetDocument(result),
      }
      return successReponse(req, res, resultData, "Create Successfully", 201);
 });

// Delete Document
  public deleteDocument = catchAsync(async (req: Request, res: Response) => {
    const document = await this.documentService.deleteDocument(req.params.id);
    await this.s3Upload.delete(document.image);
    await this.s3Upload.delete(document.link);
    return successReponse(req, res, { isDelete: true }, "Deleted Succesfully");
  });
}
