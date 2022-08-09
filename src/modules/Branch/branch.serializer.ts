export interface IResponseBranch {
  _id: string;
  name: string;
  created_by: string;
  updated_by: string;
  created_at: Date;
  updated_at: Date;
}
export interface IResultBranch {
  _id: string;
  name: string;
}

export function serializerBranch(model: any): IResponseBranch{
  return {
    _id: model._id,
    name: model.name,
    created_by: model.created_by,
    updated_by: model.updated_by,
    created_at: model.created_at,
    updated_at: model.updated_at,
  };
}

export function serializerGetBranch(model: any): IResultBranch{
  return {
    _id: model._id,
    name: model.name,
  };
}
