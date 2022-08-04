export interface IResponsePost {
  _id: string;
  user: object;
  title: string;
  tags: object[];
  content: string;
  category: object;
  views: number;
  comments: object[];
  created_by: string;
  updated_by: string;
  created_at: Date;
  updated_at: Date;
}

export interface IResultPost {
  _id: string;
  user: string;
  title: string;
  tags: string[];
  content: string;
  category: string;
  views: number;
  comments: object[];
  created_at: Date;
}

export function serializerGetPost(model: any): IResultPost {
  return {
    _id: model._id,
    user: model.user_id,
    title: model.title,
    tags: model.tags,
    content: model.content,
    category: model.category,
    views: model.views,
    comments: model.comment,
    created_at: model.created_at,
  };
}

export function serializerPost(model: any): IResponsePost {
  return {
    _id: model._id,
    user: model.user_id,
    title: model.title,
    tags: model.tags,
    content: model.content,
    category: model.category,
    views: model.views,
    comments: model.comments,
    created_by: model.created_by,
    updated_by: model.updated_by,
    created_at: model.created_at,
    updated_at: model.updated_at,
  };
}
