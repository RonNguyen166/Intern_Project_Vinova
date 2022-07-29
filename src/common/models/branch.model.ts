import { Schema, model } from "mongoose";
import { IBase, SchemaBase } from "./base.model";

export interface IBranch extends IBase {
    name: string;
}

const BranchSchema = new Schema<IBranch>(
  SchemaBase({
    name:{
        type: String,
        required: true,
      }
  }),
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

export default model<IBranch>("Branchs", BranchSchema);
