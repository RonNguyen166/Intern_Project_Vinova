import {
  IRedemption,
  Redemption,
} from "./../../common/models/redemption.model";
import mongoose from "mongoose";

export default class RedemptionService {
  public async getAllRedemptions() {
    try {
      const redemptions = await Redemption.find().populate("product_id").populate("user", "alias point");
      return redemptions;
    } catch (err) {
      throw err;
    }
  }
  public async getRedemption(id: string) {
    try {
      const redemption = await Redemption.findById(id);
      return redemption;
    } catch (err) {
      throw err;
    }
  }
  public async createRedemption(body: object) {
    try {
      const redemption = await Redemption.create(body);
      return redemption;
    } catch (err) {
      throw err;
    }
  }
  public async getRedemptionByUserId(userid: mongoose.Schema.Types.ObjectId) {
    try {
      const redemptions = await Redemption.find({ user: userid }).populate("product_id").populate("user", "alias point");
      return redemptions;
    } catch (err) {
      throw err;
    }
  }

  public async getTopRedeem() {
    try {
      const redemptions = await Redemption.aggregate([
        {
          $group: {
            _id: "$product_id",
            count: { $sum: "$quantity" },
          },
        },
        {
          $lookup: {
            from: "products",
            localField: "_id",
            foreignField: "_id",
            as: "product",
          },
        },
        {
          $sort: { count: -1 },
        },
      ]);
      return redemptions;
    } catch (err) {
      throw err;
    }
  }
}
