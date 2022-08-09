import express from "express";
import ProductService from "./product.services";
import {IResultProduct, serializerProduct} from "./product.serializer";
import ApiFeature from "../../utils/apiFeatures";
import {s3Upload, s3GetUpload, s3DeleteUpload} from "../../common/services/upload2.service";

export default class ProductController {
  private productService: ProductService = new ProductService();
  //public s3Upload: S3Upload = new S3Upload(); 
  public getAllProduct = async <ProductController>(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const products = await this.productService.getAllProduct(req.query);
      const serializedResults = products.map((ele: any) =>
      serializerProduct(ele)
    );
      return res.status(200).json({
        status: "success",
        length: serializedResults.length,
        data: {
          serializedResults,
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
      const product: any = await this.productService.getProduct(req.params.id);
      //const photoURL = await s3GetUpload(product.photo);
      //console.log(product.photoURL);
      const serializedResults = serializerProduct(product);

      return res.status(200).json({
        status: "success",
        data:{
          product,
          //url: photoURL
        }
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
      if (!req.authenticatedUser) {
        throw "Please login to get access";
      }
      //console.log(req.body);
      if(req.file){
        const url = await s3Upload(req.file);
        req.body.photo = url;
      }
      let bodyObj: any = { ...req.body }; 
      //console.log(bodyObj);     
      bodyObj.user = req.authenticatedUser._id;

      const product = await this.productService.createProduct(bodyObj);
      return res.status(201).json({
        status: "success",
        data: {
          product,
        },
      });
    } catch (err) {
      //console.log(err);
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
      //console.log(req.body);
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
