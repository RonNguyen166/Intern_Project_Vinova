import { Schema, model } from "mongoose";
import { IBase, SchemaBase } from "./base.model";

export interface IPost extends IBase {
  user_id: Schema.Types.ObjectId;
  title: string;
  tags: Schema.Types.ObjectId[];
  content: string;
  category: Schema.Types.ObjectId;
  views: number;
  comments: Schema.Types.ObjectId[];
  favorites: Schema.Types.ObjectId[];
  toView: Function;
}

const postSchema: Schema = new Schema<IPost>(
  SchemaBase({
    user_id: { type: Schema.Types.ObjectId, ref: "Users" },
    title: { type: String, required: true },
    tags: [{ type: Schema.Types.ObjectId, ref: "Tags" }],
    content: { type: String, required: true },
    category: { type: Schema.Types.ObjectId, ref: "Categories" },
    views: { type: Number, default: 0 },
    comments: [{ type: Schema.Types.ObjectId, ref: "Comments" }],
    favorites: [{ type: Schema.Types.ObjectId, ref: "Users" }],
  }),
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

postSchema.index({ title: "text", tags: "text", content: "text", category: 1 });

postSchema.methods.toView = async function (): Promise<Error | number> {
  return ++this.views && this.save();
};

export default model<IPost>("Posts", postSchema);
