import mongoose from "mongoose";

export interface IRedemption {
  user_id: mongoose.Schema.Types.ObjectId;
  product_id: mongoose.Schema.Types.ObjectId;
  type: string;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
}

const schema = new mongoose.Schema<IRedemption>(
  {
    type: {
      type: String,
      default: "redeem",
      set(value: any) {
        return "redeem";
      },
    },
    quantity: {
      type: Number,
      required: [true, "A redemption must have a valid quantity"],
    },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  },
  { timestamps: true }
);

export const Redemption: mongoose.Model<IRedemption> =
  mongoose.model<IRedemption>("Redemption", schema);
