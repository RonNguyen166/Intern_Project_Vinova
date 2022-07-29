import { Request, Response } from "express";
import CategoryService from "./category.services";
import { serializerCategory, serializerGetCategory } from "./category.serializer";
import { successReponse } from "../../common/services/response.sevice";
import Category from "../../common/models/category.model";
import { ICategoryGet, ICategoryUpdate } from "./category.interface";
import catchAsync from "../../utils/catchAsync";
import { any } from "joi";

export default class CategoryController {
  public categoryService: CategoryService = new CategoryService(Category)

  public createCategory = catchAsync(async (req: Request, res: Response) => {
    const result = await this.categoryService.createCategory(req.body);
    const resultData: object = {
      category: serializerGetCategory(result),
    };
    return successReponse(req, res, resultData, "Create Successfully", 201);
  });

  public getAllCategorys = catchAsync(async (req: Request, res: Response) => {
    const results = await this.categoryService.getAllCategorys();
    const serializedResults = results.map((ele: any) =>
      ele.id ? serializerGetCategory(ele) : serializerCategory(ele)
    );
    const resultData: object = {
      categorys: serializedResults,
    };
    return successReponse(req, res, resultData, "Get Successfully");
  });


  public getCategory = catchAsync(async (req: Request, res: Response) => {
    const filter: object = {
      _id: req.params.id,
      isDelete: false,
    };
    const result = await this.categoryService.getCategory(filter);
    const resultData: object = {
      category: serializerGetCategory(result),
    };
    return successReponse(req, res, resultData, "Get Succesfully");
  });

  public updateCategory = catchAsync(async (req: Request, res: Response) => {
    const filter: object = {
      _id: req.params.id,
      isDelete: false,
    };
    const dataBody: ICategoryUpdate = { ...req.body };
    const result = await this.categoryService.updateCategory(filter, dataBody);
    const resultData: object = {
      category: serializerGetCategory(result),
    };
    return successReponse(req, res, resultData, "Updated Succesfully");
  });

  public deleteCategory = catchAsync(async (req: Request, res: Response) => {
    const filter: object = {
      _id: req.params.id,
      isDelete: false,
    };
    await this.categoryService.deleteCategory(filter);
    return successReponse(req, res, { isDelete: true }, "Updated Succesfully");
  });
}
