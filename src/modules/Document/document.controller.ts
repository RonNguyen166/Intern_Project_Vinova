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

export default class DocumentController {
  public documentService: DocumentService = new DocumentService(Document);
  public s3Upload: S3Upload = new S3Upload();

  public createDocument = catchAsync(async (req: Request, res: Response) => {
    if (req.file) {
      const url = await this.s3Upload.put(req.file);
      req.body.image = url;
      req.body.link = url;
    }
    const data: IDocumentCreate = req.body;
    const result = await this.documentService.createDocument(data);
    const resultData: object = {
      document: serializerGetDocument(result),
    };
    return successReponse(req, res, resultData, "Create Successfully", 201);
  });

  public getAllDocuments = catchAsync(async (req: Request, res: Response) => {
    const results = await this.documentService.getAllDocuments();

    const serializedResults = results.map((ele: any) => serializerGetDocument(ele));
    const resultData: object = {
      documents: serializedResults,
    };
    return successReponse(req, res, resultData, "Get Successfully");
  });

  public getDocument = catchAsync(async (req: Request, res: Response) => {
    const result = await this.documentService.getDocument({ _id: req.params.id });
    result.imageUrl = await this.s3Upload.get(result.image);
    result.linkUrl = await this.s3Upload.get(result.link)
    const resultData: object = {
      document: serializerGetDocument(result),
    };
    return successReponse(req, res, resultData, "Get Succesfully");
  });

  public updateDocument = catchAsync(async (req: Request, res: Response) => {
    if (req.file) {
      const url = await this.s3Upload.put(req.file);
      req.body.photo = url;
      req.body.link = url;
    }
    const dataBody: IDocumentUpdate = { ...req.body };

    const result = await this.documentService.updateDocument(req.params.id, dataBody);
    const resultData: object = {
      document: serializerDocument(result),
    };
    return successReponse(req, res, resultData, "Updated Succesfully");
  });

  public deleteDocument = catchAsync(async (req: Request, res: Response) => {
    const document = await this.documentService.deleteDocument(req.params.id);
    await this.s3Upload.delete(document.image);
    await this.s3Upload.delete(document.link);
    return successReponse(req, res, { isDelete: true }, "Deleted Succesfully");
  });
}
