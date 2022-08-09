import { Model } from "mongoose";
import { ICategory } from "../../common/models/category.model";
import { BaseRepository } from "../../common/repository/base.repository";
import AppError from "../../utils/appError";
import { ErrorResponsesCode } from "../../utils/constants";
export default class CategoryService extends BaseRepository<ICategory> {
  constructor(public readonly categoryRepository: Model<ICategory>) {
    super(categoryRepository);
  }
  async getAllCategorys(): Promise<any> {
    try {
      const categorys = await this.getAll();
      if (!categorys) {
        throw new AppError(ErrorResponsesCode.NOT_FOUND, "Category not Exist");
      }
      return categorys;
    } catch (err) {
      throw err;
    }
  }

  async getCategory(categoryId: any): Promise<any> {
    try {
      const category = await this.getOne({ _id: categoryId });
      if (!category) {
        throw new AppError(ErrorResponsesCode.NOT_FOUND, "Category not Exist");
      }
      return category;
    } catch (err) {
      throw err;
    }
  }

  async createCategory(data: any): Promise<any> {
    try {
      const category = await this.create(data);
      return category;
    } catch (err) {
      throw err;
    }
  }

  async updateCategory(categoryId: any, data: object) {
    try {
      const category = await this.update({ _id: categoryId }, data);
      if (!category) {
        throw new AppError(ErrorResponsesCode.NOT_FOUND, "Categorys not Exist");
      }
      return category;
    } catch (err) {
      throw err;
    }
  }
  async deleteCategory(categoryId: any) {
    try {
      const category = await this.delete({ _id: categoryId });
      if (!category) {
        throw new AppError(ErrorResponsesCode.NOT_FOUND, "Category not Exist");
      }
      return category;
    } catch (err) {
      throw err;
    }
  }
}
