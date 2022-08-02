import TransactionDetailService from "./transactiondetail.services";
import express from "express";
export default class TransactionDetailController {
  private transactionDetailService = new TransactionDetailService();

  public getAllTransDetails = async <TransactionDetailController>(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const transDetails =
        await this.transactionDetailService.getAllTransDetails();
      res.status(200).json({
        status: "success",
        length: transDetails.length,
        data: {
          transDetails,
        },
      });
    } catch (err) {
      res.status(400).json({
        status: "error",
        message: err,
      });
    }
  };

  public getTransDetail = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const transDetail = await this.transactionDetailService.getTransDetail(
        req.params.id
      );
      res.status(200).json({
        status: "success",
        data: {
          transDetail,
        },
      });
    } catch (err) {
      res.status(400).json({
        status: "error",
        message: err,
      });
    }
  };

  public createTransDetail = async <TransactionDetailController>(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const transDetail = await this.transactionDetailService.createTransDetail(
        req.body
      );
      res.status(200).send({
        status: "success",
        data: {
          transDetail,
        },
      });
    } catch (err) {
      res.status(400).send({
        status: "error",
        message: err,
      });
    }
  };
}
