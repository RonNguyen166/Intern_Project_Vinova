import { Schema, model } from "mongoose";
import { IBase, SchemaBase } from "./base.model";

export interface IDocument extends IBase {
    image:string;
    title: string;
    link: string;
}

const DocumentSchema = new Schema<IDocument>(
  SchemaBase({
    image:{
        type: String
      },
      title:{
        type: String,
        required: true,
      },
      link: {
        type: String,
        required: [true, "Link cannot be empty"],
      }
  }),
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

export default model<IDocument>("Documents", DocumentSchema);
