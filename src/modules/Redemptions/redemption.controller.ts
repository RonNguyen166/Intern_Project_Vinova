import RedemptionService from "./redemption.services";
import TransactionService from "../Transactions/transaction.services";
import ProductService from "./../../modules/Products/product.services";
import Users from "./../../common/models/user.model";
import express from "express";
import { IProduct, Product } from "./../../common/models/product.model";
import mongoose from "mongoose";
import UserService from "../User/user.services";

export default class RedeemptionController {
  private redemptionService: RedemptionService = new RedemptionService();
  private transactionService: TransactionService = new TransactionService();
  private productService: ProductService = new ProductService();
  private userService: UserService = new UserService(Users);
  public createRedemption = async <RedemptionController>(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      let redemptionObj: any = {};
      redemptionObj.product_id = req.params.id;
      if (!req.body.quantity) {
        throw "Please provide quantity";
      }
      const product = await this.productService.getProduct(redemptionObj.product_id);
      if (!product) {
        throw "Please select a valid product to redeem";
      }
      if (product.quantity <= 0) {
        throw "This product is out of stock!";
      }
      if (req.body.quantity > product.quantity || req.body.quantity < 1) {
        throw "Please provide valid quantity";
      }


      redemptionObj.quantity = req.body.quantity;
      if (
        req.authenticatedUser == undefined ||
        req.authenticatedUser == null ||
        !req.authenticatedUser
      ) {
        throw "Please login to get access";
      }

      let user = await this.userService.getUser({_id: req.authenticatedUser._id});
      if(user == null){
        throw "Invalid user";
      }
  
      if(user.point.redeemPoint < product.price * redemptionObj.quantity){
        throw "Not enough point to redeem";
      }

      product.quantity -= redemptionObj.quantity;
      await product.save();
      redemptionObj.user = req.authenticatedUser._id;
      const redemption = await this.redemptionService.createRedemption(
        redemptionObj
      );

      /* Create a redeem type transaction */
      const transactionService = new TransactionService();
      let transactionSubject = `${product.title} x${redemptionObj.quantity}`;
      let transactionPoint = -product.price * redemptionObj.quantity;
      
      user.point.redeemPoint -= product.price * redemptionObj.quantity;
      await this.userService.updateUser(user._id, user);

      await transactionService.createTransaction({
        user_id: req.authenticatedUser._id,
        type: "Redemption",
        subject: transactionSubject,
        point: transactionPoint,
      });

      /* Sending response */
      return res.status(200).json({
        status: "success",
        redemption,
      });
    } catch (err) {
      console.log(err);
      return res.status(400).json({
        status: "error",
        message: err,
      });
    }
  };

  public getAllRedemptions = async <RedemptionController>(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const redemptions = await this.redemptionService.getAllRedemptions();
      return res.status(200).json({
        status: "success",
        length: redemptions.length,
        data: {
          redemptions,
        },
      });
    } catch (err) {
      return res.status(400).json({
        status: "error",
        message: err,
      });
    }
  };

  public getRedemptionsByUserId = async <RedemptionController>(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      if (!req.authenticatedUser) {
        throw "Please login to get access";
      }
      const redemptions = await this.redemptionService.getRedemptionByUserId(
        req.authenticatedUser._id
      );
      return res.status(200).json({
        status: "success",
        length: redemptions.length,
        data: {
          redemptions,
        },
      });
    } catch (err) {
      return res.status(400).json({
        status: "error",
        message: err,
      });
    }
  };

  public getTopRedeem = async <RedemptionController>(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const redemptions = await this.redemptionService.getTopRedeem();
      return res.status(200).json({
        status: "success",
        length: redemptions.length,
        data: {
          top_redeem: redemptions,
        },
      });
    } catch (err) {
      console.log(err);
      return res.status(400).json({
        status: "error",
        message: err,
      });
    }
  };
}
