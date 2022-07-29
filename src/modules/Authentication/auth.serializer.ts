import { Roles } from "../../utils/constants";

export interface IAuthResponse {
  _id: string;
  fullName: string;
  subName: string;
  alias: string;
  team: string;
  email: string;
  gender: boolean;
  dob: Date;
  country: string;
  photo: string;
  givePoint: number;
  redeemPoint: number;
  role: Roles;
  token: string;
}

export function serializerAuth(model: any): IAuthResponse {
  return {
    _id: model._id,
    fullName: model.fullName,
    subName: model.subName,
    alias: model.alias,
    team: model.team,
    email: model.email,
    gender: model.gender,
    dob: model.dob,
    country: model.country,
    photo: model.photo,
    givePoint: model.point.givePoint,
    redeemPoint: model.point.redeemPoint,
    role: model.role,
    token: model.token,
  };
}
