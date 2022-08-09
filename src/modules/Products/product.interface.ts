export interface ICreateProduct {
    title: string;
    description: string;
    quantity: number;
    price: number;
    photo?: string;
    branch_id: string;
    user?: string;
  }