export interface IResultProduct{
    _id: string;
    title: string;
    description: string;
    quantity: number;
    price: number;
    photo: string;
    user: string;
    createdAt: string;
    updatedAt: string;
}

export function serializerProduct(model: any): IResultProduct{
    return {
        _id: model._id,
        title: model.title,
        description: model.description,
        quantity: model.quantity,
        price: model.price,
        photo: model.photo,
        user: model.user,
        createdAt: model.createdAt,
        updatedAt: model.updatedAt        
    }
}