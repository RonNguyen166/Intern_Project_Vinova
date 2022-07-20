import { User, IUser } from "./../../common/models/user.model";
import mongoose, { Model } from "mongoose";
interface IResponseUser {
  _id: mongoose.Schema.Types.ObjectId;
  name: string;
  email: string;
}
export default class UserSerializer {
  serializerResponseUser(model: IUser): IResponseUser {
    return {
      _id: model._id,
      name: model.name,
      email: model.email,
    };
  }
  serializerQueryAndResponseUser(doc: any): IResponseUser[] {
    let serializedDoc = [];
    for (let i = 0; i < doc.length; i++) {
      serializedDoc.push(this.serializerResponseUser(doc[i]));
    }
    return serializedDoc;
  }
}
