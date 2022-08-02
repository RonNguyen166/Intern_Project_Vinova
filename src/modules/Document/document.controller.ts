import { Request, Response } from "express";
import DocumentService from "./document.services";
import {
  serializerDocument,
  serializerGetDocument,
} from "./document.serializer";
import { successReponse } from "../../common/services/response.service";
import Document from "../../common/models/document.model";
import { IDocumentGet, IDocumentUpdate } from "./document.interface";
import catchAsync from "../../utils/catchAsync";
import { any } from "joi";

export default class DocumentController {
  public documentService: DocumentService = new DocumentService(Document);

  public createDocument = catchAsync(async (req: Request, res: Response) => {
    const result = await this.documentService.createDocument(req.body);
    const resultData: object = {
      document: serializerGetDocument(result),
    };
    return successReponse(req, res, resultData, "Create Successfully", 201);
  });

  public getAllDocuments = catchAsync(async (req: Request, res: Response) => {
    const results = await this.documentService.getAllDocuments();
    const serializedResults = results.map((ele: any) =>
      ele.id ? serializerGetDocument(ele) : serializerDocument(ele)
    );
    const resultData: object = {
      documents: serializedResults,
    };
    return successReponse(req, res, resultData, "Get Successfully");
  });

  public getDocument = catchAsync(async (req: Request, res: Response) => {
    const filter: object = {
      _id: req.params.id,
      isDelete: false,
    };
    const result = await this.documentService.getDocument(filter);
    const resultData: object = {
      document: serializerGetDocument(result),
    };
    return successReponse(req, res, resultData, "Get Succesfully");
  });

  public updateDocument = catchAsync(async (req: Request, res: Response) => {
    const filter: object = {
      _id: req.params.id,
      isDelete: false,
    };
    const dataBody: IDocumentUpdate = { ...req.body };
    const result = await this.documentService.updateDocument(filter, dataBody);
    const resultData: object = {
      document: serializerGetDocument(result),
    };
    return successReponse(req, res, resultData, "Updated Succesfully");
  });

  public deleteDocument = catchAsync(async (req: Request, res: Response) => {
    const filter: object = {
      _id: req.params.id,
      isDelete: false,
    };
    await this.documentService.deleteDocument(filter);
    return successReponse(req, res, { isDelete: true }, "Updated Succesfully");
  });
}
