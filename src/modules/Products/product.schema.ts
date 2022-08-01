import joi from "joi";
export default class JoiSchema {
  public createSchema: joi.ObjectSchema = joi.object({
    title: joi.string().min(1).required(),
    quantity: joi.number().required(),
    price: joi.number().required(),
    status: joi.boolean().required(),
  });
  public updateSchema: joi.ObjectSchema = joi.object({
    title: joi.string().min(1),
    quantity: joi.number(),
    price: joi.number(),
    status: joi.boolean(),
  });
}
