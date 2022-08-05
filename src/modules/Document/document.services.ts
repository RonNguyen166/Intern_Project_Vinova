import mongoose, { Model } from "mongoose";
import Document, { IDocument } from "../../common/models/document.model";
import { BaseRepository } from "../../common/repository/base.repository";
import AppError from "../../utils/appError";
export default class DocumentService extends BaseRepository<IDocument> {
  constructor(public readonly documentRepository: Model<IDocument>) {
    super(documentRepository);
  }
  async getAllDocuments(): Promise<any> {
    try {
      const documents = await this.getAll();
      if (!documents) {
        throw new AppError(404, "Document not Exist");
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
        throw new AppError(404, "Document not Exist");
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
        throw new AppError(404, "Documents not Exist");
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
        throw new AppError(404, "Document not Exist");
      }
      return document;
    } catch (err) {
      throw err;
    }
  }
}
