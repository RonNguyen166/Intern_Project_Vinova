import mongoose from "mongoose";
import express from "express";
import TransactionService from "./transaction.services";
import TransactionDetailService from "../TransactionDetails/transactiondetail.services";
import {
  TransactionDetail,
  ITransactionDetail,
} from "../../common/models/transactiondetail.model";
import { Tag, ITag } from "../../common/models/tag.model";
import User from "../../common/models/user.model";
export default class TransactionController {
  private transactionService: TransactionService = new TransactionService();
  private transactionDetailService: TransactionDetailService =
    new TransactionDetailService();
  public getAllTransactions = async <TransactionController>(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const transaction = await this.transactionService.getAllTransactions();
      res.status(200).json({
        status: "success",
        length: transaction.length,
        data: {
          transaction,
        },
      });
    } catch (err) {
      res.status(401).json({
        status: "error",
        message: err,
      });
    }
  };
  public getTransaction = async <TransactionController>(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const transaction = await this.transactionService.getTransaction(
        req.params.id
      );
      res.status(200).json({
        status: "success",
        data: transaction,
      });
    } catch (err) {
      res.status(400).json({
        status: "error",
        message: err,
      });
    }
  };
  public getTransactionByUserId = async <TransactionController>(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      if (!req.authenticatedUser) {
        throw "Please login to get access";
      }
      const transactions = await this.transactionService.getTransactionByUserId(
        req.authenticatedUser._conditions._id
      );
      res.status(200).json({
        status: "success",
        length: transactions.length,
        data: {
          transactions,
        },
      });
    } catch (err) {
      //console.log(err);
      res.status(400).json({
        status: "error",
        message: err,
      });
    }
  };

  public createTransaction = async <TransactionController>(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      // +100 @Dana #vinova-family Team HN cảm ơn em :))
      const postBody = req.body.post;
      const transactionObj: any = {};
      transactionObj.subject = postBody;
      if (!req.authenticatedUser) {
        throw "Please login to get access";
      }
      transactionObj.user_id = req.authenticatedUser._conditions._id;
      //console.log(transactionObj.user_id);
      let postToken = postBody.split(" ");
      transactionObj.type = "Give Pt";

      //console.log(transactionObj.point, typeof transactionObj.point);
      let toUsersArray = [];
      let tagStrings = [];
      for (let i = 1; i < postToken.length; i++) {
        if (postToken[i].startsWith("@")) {
          toUsersArray.push(postToken[i].replace("@", ""));
        }
        if (postToken[i].startsWith("#")) {
          tagStrings.push(postToken[i]);
        }
      }

      transactionObj.point = `-${
        postToken[0].replace("+", "") * 1 * toUsersArray.length
      }`;

      //console.log("toUsersArray: " + toUsersArray);
      //console.log("TAGSTRINGS: " + tagStrings);
      /*
      Process Tag
      */
      let tagIds: any = [];
      await Promise.all(
        tagStrings.map(async (tagString) => {
          let tag = await Tag.findOne({ name: tagString });
          if (!tag) {
            try {
              tag = await Tag.create({
                name: tagString,
                amount: 1,
              });
              console.log(tagIds);
              tagIds.push(tag._id);
            } catch (err) {
              throw err;
            }
          } else {
            try {
              tagIds.push(tag._id);
              tag.amount += 1;
              await tag.save();
            } catch (err) {
              throw err;
            }
          }
        })
      );
      console.log(tagIds);
      transactionObj.tag = tagIds;
      console.log(transactionObj.tag);

      /* Check if received user exists */
      let toUsersIdArray = [];
      for (let i = 0; i < toUsersArray.length; i++) {
        const receivedUser = await User.findOne({
          name: toUsersArray[i],
        });
        if (receivedUser == null) {
          throw "Received user not exist!";
        }
      }

      /* Create transaction */
      const transaction = await this.transactionService.createTransaction(
        transactionObj
      );

      /* Create received transaction */
      let transactionReceived: any = {};
      transactionReceived.point = postToken[0];
      transactionReceived.type = "Receive Pt";
      transactionReceived.subject = transaction.subject;
      transactionReceived.createdAt = transaction.createdAt;
      transactionReceived.updatedAt = transaction.updatedAt;
      //console.log("HERERERERERERERERER : " + transactionReceived);

      /* Create transaction detail */
      let transDetailsObj: any = {};
      transDetailsObj.transaction_id = transaction._id;
      transDetailsObj.createdAt = transaction.createdAt;
      transDetailsObj.updatedAt = transaction.updatedAt;

      for (let i = 0; i < toUsersArray.length; i++) {
        //console.log(toUsersArray[i], toUsersArray.length);
        transDetailsObj.user_id_to = await User.findOne({
          name: toUsersArray[i],
        });

        transDetailsObj.user_id_to = transDetailsObj.user_id_to._id;

        transactionReceived.user_id = transDetailsObj.user_id_to;
        //console.log(transactionReceived);
        await this.transactionService.createTransaction(transactionReceived);

        //console.log(transDetailsObj.user_id_to);
        toUsersArray[i] = transDetailsObj.user_id_to;
        await this.transactionDetailService.createTransDetail(transDetailsObj);
        //console.log(transDetailsObj);
      }

      return res.status(201).json({
        status: "success",
        data: {
          created_transaction: transaction,
        },
      });
    } catch (err) {
      //console.log(err);
      return res.status(400).json({
        status: "error",
        message: err,
      });
    }
  };

  public getTopReceivers = async <TransactionController>(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      //console.log("get top receivers");
      const topReceivers = await this.transactionService.getTopReceivers();
      return res.status(200).json({
        status: "success",
        length: topReceivers.length,
        data: {
          topReceivers,
        },
      });
    } catch (err) {
      return res.status(400).json({
        status: "error",
        message: err,
      });
    }
  };
  public getTopGivers = async <TransactionController>(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      console.log("get top receivers");
      const topGivers = await this.transactionService.getTopGivers();
      return res.status(200).json({
        status: "success",
        length: topGivers.length,
        data: {
          topGivers,
        },
      });
    } catch (err) {
      return res.status(400).json({
        status: "error",
        message: err,
      });
    }
  };
}