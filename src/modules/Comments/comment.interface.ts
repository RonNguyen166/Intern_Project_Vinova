export interface ICommentCreate {
    content: string;
    user_id: string;
    parent_id: string
}

export interface ICommentUpdate {
    content: string;
    user_id: string;
    parent_id: string
}
export interface ICommentGet {
    content: string;
    user_id: string;
    parent_id: string
}
export interface ICommentDelete {
    content: string;
    user_id: string;
    parent_id: string
}