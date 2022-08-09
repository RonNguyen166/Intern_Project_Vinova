import joi from "joi";
export default class JoiSchema {
  public createSchema: joi.ObjectSchema = joi.object({
    body: joi.object().keys({
      quantity: joi.number().required(),
      title: joi.string().min(1).required(),
      price: joi.number().required(),
      branch_id: joi.string().required(),
      description: joi.string()
    }),
  });
  public updateSchema: joi.ObjectSchema = joi.object({
    body: joi.object().keys({
      title: joi.string().min(1),
      quantity: joi.number(),
      price: joi.number(),
      branch_id: joi.string().required(),
      description: joi.string()
    })
  });
}
