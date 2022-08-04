import mongoose, {Schema, model} from "mongoose";
import { IBase, SchemaBase } from "./base.model";

export interface IComment extends IBase {
  content: string;
  user_id: mongoose.Schema.Types.ObjectId;
  parent_id: mongoose.Schema.Types.ObjectId[];
}

const CommentSchema = new Schema<IComment>(
  SchemaBase({
    content: {
      type: "String",
      required: [true, "A comment cannot be empty"],
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    parent_id:[ {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "Comments",
    }],
  }),
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

export default model<IComment>("Comments", CommentSchema);
