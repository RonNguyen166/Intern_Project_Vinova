import { Schema, model } from "mongoose";
import { IBase, SchemaBase } from "./base.model";

export interface ICategory extends IBase {
  name: string;
}

const CategorySchema = new Schema<ICategory>(
  SchemaBase({
    name: {
      type: String,
      required: true,
    },
  }),
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

export default model<ICategory>("Categories", CategorySchema);
