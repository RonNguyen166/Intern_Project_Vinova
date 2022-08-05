import mongoose from "mongoose";
import express from "express";
import TransactionService from "./transaction.services";
import TransactionDetailService from "../TransactionDetails/transactiondetail.services";
import UserService from "./../../modules/User/user.services";

import Tag from "../../common/models/tag.model"
import Users from "../../common/models/user.model";
export default class TransactionController {
  private transactionService: TransactionService = new TransactionService();
  private transactionDetailService: TransactionDetailService =
    new TransactionDetailService();
  private userService: UserService = new UserService(Users);
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
      console.log(err);
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
      console.log(err);
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
        req.authenticatedUser._id
      );

      var totalPointsReceived = 0;
      var totalPointsGiven = 0;
      var totalRedemptions = 0;
      for(let i = 0; i < transactions.length; i++){
        if(transactions[i].type === "Receive Pt"){
          totalPointsReceived += transactions[i].point;
        }
        else if(transactions[i].type === "Give Pt"){
          totalPointsGiven = totalPointsGiven + transactions[i].point;
        }
        else if(transactions[i].type === "Redemption"){
          totalRedemptions += 1;
        }
      }
      totalPointsGiven *= -1; 
      res.status(200).json({
        status: "success",
        length: transactions.length,
        data: {
          points_received: totalPointsReceived,
          points_given: totalPointsGiven,
          redemptions: totalRedemptions,
          transactions: transactions,
        },
      });
    } catch (err) {
      console.log(err);
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
      const postBody = req.body?.post;
      //console.log(req.body);
      const transactionObj: any = {};
      transactionObj.subject = postBody;
      if (!req.authenticatedUser) {
        throw "Please login to get access";
      }
      let fromUser: any = await this.userService.getUser({_id: req.authenticatedUser._id});
    
      if(fromUser == null){
        throw "Invalid user!";
      }
      transactionObj.user = req.authenticatedUser._id;
      let postToken = postBody.split(" ");
      
      

      transactionObj.type = "Give Pt";


      let toUsersArray = [];
      let tagStrings = [];
      for (let i = 1; i < postToken.length; i++) {
        if (postToken[i].startsWith("@")) {
          toUsersArray.push(postToken[i].replace("@", ""));
          //console.log(postToken[i]);
        }
        if (postToken[i].startsWith("#")) {
          tagStrings.push(postToken[i]);
        }
      }

      transactionObj.point = `-${
        postToken[0].replace("+", "") * 1 * toUsersArray.length
      }`;


      /* Check if user has enough point to give? */
      let totalPointNeeded = parseInt(transactionObj.point.replace("-","" ));
      
      if (totalPointNeeded > fromUser.point.givePoint) {
        throw "Not enough points to give"; 
      }
      fromUser.point.givePoint -= totalPointNeeded;
      //fromUser.save();

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
              //console.log(tagIds);
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
      //console.log(tagIds);
      transactionObj.tag = tagIds;
      //console.log(transactionObj.tag);

      /* Check if received user exists */
      let toUsersIdArray = [];
      for (let i = 0; i < toUsersArray.length; i++) {
        const receivedUser = await Users.findOne({
          alias: toUsersArray[i],
        });

        if (receivedUser == null) {
          throw "Received user not exist!";
        }
        toUsersIdArray.push(receivedUser);
      }
      /* calculate point for each user in transaction and update them */
      //console.log("TOUSERARRAY" + toUsersIdArray[0]);
      for(let i = 0; i < toUsersIdArray.length; i++){
        toUsersIdArray[i].point.givePoint += parseInt(postToken[0]);
        await Users.findOneAndUpdate({_id: toUsersIdArray[i]._id}, toUsersIdArray[i]);
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
        transDetailsObj.user_id_to = await Users.findOne({
          alias: toUsersArray[i],
        });
        //console.log(transDetailsObj.user_id_to);
        transDetailsObj.user_id_to = transDetailsObj.user_id_to._id;
        transactionReceived.user = transDetailsObj.user_id_to;
        await this.transactionService.createTransaction(transactionReceived);
        toUsersArray[i] = transDetailsObj.user_id_to;
      }
      transDetailsObj.user_id_to = toUsersArray;
  
      await this.transactionDetailService.createTransDetail(transDetailsObj);
      /* Update score for Give User */
      await Users.findOneAndUpdate({_id: fromUser._id}, fromUser);
      return res.status(201).json({
        status: "success",
        data: {
          created_transaction: transaction,
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
      //console.log("get top receivers");
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
