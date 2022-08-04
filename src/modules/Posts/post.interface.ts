export interface ICreatePost {
  user_id: string;
  title: string;
  tags: string;
  content: string;
  category: string;
}

export interface IUpdatePost {
  title?: string;
  tags?: string;
  content?: string;
  category?: string;
  views?: number;
  comments?: string[];
}

export interface IGetPost {
  page?: string;
  size?: string;
  category?: string;
  search?: string;
  sortBy?: string;
  orderBy?: string;
}
