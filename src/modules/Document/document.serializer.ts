import { Roles } from "../../utils/constants";

export interface IResponseDocument {
  _id: string;
  image:string;
  title: string;
  link: string;
  created_by: string;
  updated_by: string;
  created_at: Date;
  updated_at: Date;
}
export interface IResultDocument {
  _id: string;
  image:string;
  title: string;
  link: string;
}

export function serializerDocument(model: any): IResponseDocument {
  return {
    _id: model._id,
    image: model.image,
    title: model.title,
    link: model.link,
    created_by: model.created_by,
    updated_by: model.updated_by,
    created_at: model.created_at,
    updated_at: model.updated_at,
  };
}

export function serializerGetDocument(model: any): IResultDocument {
  return {
    _id: model._id,
    image: model.image,
    title: model.title,
    link: model.link,
  };
}
