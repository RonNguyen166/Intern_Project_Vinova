export interface IResponseCategory {
  _id: string;
  name: string;
  created_by: string;
  updated_by: string;
  created_at: Date;
  updated_at: Date;
}
export interface IResultCategory {
  _id: string;
  name: string;
}

export function serializerCategory(model: any): IResponseCategory{
  return {
    _id: model._id,
    name: model.name,
    created_by: model.created_by,
    updated_by: model.updated_by,
    created_at: model.created_at,
    updated_at: model.updated_at,
  };
}

export function serializerGetCategory(model: any): IResultCategory{
  return {
    _id: model._id,
    name: model.name,
  };
}
