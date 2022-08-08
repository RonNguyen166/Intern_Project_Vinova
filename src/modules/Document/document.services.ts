import { Model } from "mongoose";
import { IDocument } from "../../common/models/document.model";
import { BaseRepository } from "../../common/repository/base.repository";
import AppError from "../../utils/appError";
import { ErrorResponsesCode } from "../../utils/constants";
export default class DocumentService extends BaseRepository<IDocument> {
  constructor(public readonly documentRepository: Model<IDocument>) {
    super(documentRepository);
  }
  async getAllDocuments(): Promise<any> {
    try {
      const documents = await this.getAll();
      if (!documents) {
        throw new AppError(ErrorResponsesCode.NOT_FOUND, "Document not Exist");
      }
      return documents
    } catch (err) {
      throw err;
    }
  }

  async getDocument(documentId: any): Promise<any> {
    try {
      const document = await this.getOne({ _id: documentId });
      if (!document) {
        throw new AppError(ErrorResponsesCode.NOT_FOUND, "Document not Exist");
      }
      return document;
    } catch (err) {
      throw err;
    }
  }

  async createDocument(data: any): Promise<any> {
    try {
      const document = await this.create(data);
      return document;
    } catch (err) {
      throw err;
    }
  }

  async updateDocument(documentId: any, data: object) {
    try {
      const document = await this.update({ _id: documentId }, data);
      if (!document) {
        throw new AppError(ErrorResponsesCode.NOT_FOUND, "Documents not Exist");
      }
      return document;
    } catch (err) {
      throw err;
    }
  }
  async deleteDocument(documentId: any) {
    try {
      const document = await this.delete({ _id: documentId });
      if (!document) {
        throw new AppError(ErrorResponsesCode.NOT_FOUND, "Document not Exist");
      }
      return document;
    } catch (err) {
      throw err;
    }
  }
}
