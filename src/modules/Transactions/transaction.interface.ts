import mongoose from "mongoose";
export interface IResponseTransaction {
  user_id: mongoose.Types.ObjectId;
  type: string;
  tag?: [mongoose.Types.ObjectId];
  subject: string;
  point: number;
  pointString: string;
  createdAt: Date;
  updatedAt: Date;
}
