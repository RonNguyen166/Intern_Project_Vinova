import { Document, Schema, SchemaTypes, model } from "mongoose";
import { IBase, SchemaBase } from "./base.model";

export interface IPoint extends IBase {
  givePoint: number;
  redeemPoint: number;
}

const PointSchema = new Schema<IPoint>(
  SchemaBase({
    givePoint: {
      type: Number,
      default: 0,
    },
    redeemPoint: {
      type: Number,
      default: 0,
    },
  }),
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

export default model<IPoint>("Points", PointSchema);
