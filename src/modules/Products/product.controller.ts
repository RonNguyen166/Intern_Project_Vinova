import express from "express";
import ProductService from "./product.services";
import ApiFeature from "../../utils/apiFeatures";

export default class ProductController {
  private productService: ProductService = new ProductService();

  public getAllProduct = async <ProductController>(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const products = await this.productService.getAllProduct(req.query);
      return res.status(200).json({
        status: "success",
        length: products.length,
        data: {
          products,
        },
      });
    } catch (err) {
      console.log(err);
      return res.status(400).json({
        status: "Cannot get products!",
        message: err,
      });
    }
  };
  public getProduct = async <ProductController>(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const product = await this.productService.getProduct(req.params.id);
      return res.status(200).json({
        status: "success",
        data: {
          product,
        },
      });
    } catch (err) {
      return res.status(400).json({
        status: "Cannot get product with that id!",
        message: err,
      });
    }
  };

  public createProduct = async <ProductController>(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      let bodyObj: any = { ...req.body };
      if (!req.authenticatedUser) {
        throw "Please login to get access";
      }
      bodyObj.user_id = req.authenticatedUser._conditions._id;
      const product = await this.productService.createProduct(bodyObj);
      return res.status(201).json({
        status: "success",
        data: {
          product,
        },
      });
    } catch (err) {
      return res.status(400).json({
        status: "error",
        message: "Cannot create product",
      });
    }
  };

  public updateProduct = async <ProductController>(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      console.log(req.body);
      const product = await this.productService.updateProduct(
        req.params.id,
        req.body
      );
      return res.status(200).json({
        status: "success",
        data: {
          product,
        },
      });
    } catch (err) {
      return res.status(400).json({
        status: "error",
        message: "Cannot update product with that id!",
      });
    }
  };

  public deleteProduct = async <ProductController>(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      this.productService.deleteProduct(req.params.id);
      res.status(200).json({
        status: "success",
        data: null,
      });
    } catch (err) {
      res.status(400).json({
        status: "error",
        message: "Cannot delete that product",
      });
    }
  };
}
