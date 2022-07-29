import { Model } from "mongoose";
import AppError from "../../utils/appError";
import { IRead, IWrite } from "./inteface.repository";
import { ErrorMessages, ErrorResponsesCode } from "../../utils/constants";

export abstract class BaseRepository<T> implements IWrite<T>, IRead<T> {
  private entity: Model<T>;
  constructor(entity: Model<T>) {
    this.entity = entity;
  }
  public async create(data: object): Promise<T> {
    try {
      const results = new this.entity(data);
      await results.save();
      return results;
    } catch (error) {
      throw error;
    }
  }

  public async getAll(): Promise<T[]> {
    try {
      const filter: object = { isDelete: false };
      const results = await this.entity.find(filter).sort({ created_at: -1 });

      if (!results)
        throw new AppError(
          ErrorResponsesCode.NOT_FOUND,
          ErrorMessages.NOT_FOUND
        );
      return results;
    } catch (error) {
      throw error;
    }
  }
  public async getOne(filter: object): Promise<T> {
    try {
      filter = { ...filter, isDelete: false };
      const results = await this.entity.findOne(filter).exec();
      if (!results)
        throw new AppError(
          ErrorResponsesCode.NOT_FOUND,
          ErrorMessages.NOT_FOUND
        );
      return results;
    } catch (error) {
      throw error;
    }
  }

  public async update(filter: object, data: object): Promise<T> {
    try {
      filter = { ...filter, isDelete: false };
      const results = await this.entity
        .findOneAndUpdate(filter, data, { new: true })
        .exec();

      if (!results)
        throw new AppError(
          ErrorResponsesCode.NOT_FOUND,
          ErrorMessages.NOT_FOUND
        );
      return results;
    } catch (error) {
      throw error;
    }
  }

  public async delete(filter: object): Promise<T> {
    try {
      filter = { ...filter, isDelete: false };
      const results = await this.entity
        .findOneAndUpdate(filter, { isDelete: true }, { new: true })
        .exec();
      if (!results)
        throw new AppError(
          ErrorResponsesCode.NOT_FOUND,
          ErrorMessages.NOT_FOUND
        );
      return results;
    } catch (error) {
      throw error;
    }
  }
}
