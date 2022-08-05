import { model, Schema } from "mongoose";
import { IBase, SchemaBase } from "./base.model";

export interface ITag extends IBase {
  name: string;
  amount: number;
  increaseAmount: Function;
  decreaseAmount: Function;
}

const tagSchema: Schema = new Schema<ITag>(
  SchemaBase({
    name: {
      type: String,
      required: true,
      unique: true,
    },
    amount: {
      type: Number,
      default: 1,
    },
  }),
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

tagSchema.index({ name: "text" });

tagSchema.methods.increaseAmount = async function (): Promise<any> {
  return ++this.amount && this.save();
};

tagSchema.methods.decreaseAmount = async function (): Promise<any> {
  return this.amount && this.amount-- && this.save();
};

export default model<ITag>("Tags", tagSchema);
