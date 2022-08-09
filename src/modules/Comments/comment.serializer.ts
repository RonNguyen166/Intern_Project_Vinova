export interface IResponseComment {
  _id: string;
  content: string;
  user_id: string;
  post_id: string;
  parent_id: string;
  reply: boolean;
  replies: string[];
  created_by: string;
  updated_by: string;
  created_at: Date;
  updated_at: Date;
}
export interface IResultComment {
  _id: string;
  content: string;
  post_id: string;
  user_id: string;
  parent_id: string;
  reply: boolean;
  replies: string[];
  created_at: Date;
  updated_at: Date;
}

export function serializerComment(model: any): IResponseComment {
  return {
    _id: model._id,
    content: model.content,
    user_id: model.user_id,
    post_id: model.post_id,
    parent_id: model.parent_id,
    reply: model.reply,
    replies: model.replies,
    created_by: model.created_by,
    updated_by: model.updated_by,
    created_at: model.created_at,
    updated_at: model.updated_at,
  };
}

export function serializerGetComment(model: any): IResultComment {
  return {
    _id: model._id,
    content: model.content,
    user_id: model.user_id,
    post_id: model.post_id,
    reply: model.reply,
    replies: model.replies,
    parent_id: model.parent_id,
    created_at: model.created_at,
    updated_at: model.updated_at,
  };
}
