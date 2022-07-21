import joi from "joi";
export default class JoiSchema {
  private nameRegex: RegExp = /^[a-zA-Z\s]+$/i;
  private passwordRegex: RegExp = /[a-zA-Z0-9]/;
  public createSchema: joi.ObjectSchema = joi.object({
    name: joi
      .string()
      .pattern(new RegExp(this.nameRegex))
      .min(1)
      .max(100)
      .required(),
    password: joi
      .string()
      .pattern(new RegExp(this.passwordRegex))
      .min(8)
      .max(40)
      .required(),
    email: joi.string().email().required(),
  });
  public updateSchema: joi.ObjectSchema = joi.object({
    name: joi.string().pattern(new RegExp(this.nameRegex)).min(1).max(100),
    password: joi
      .string()
      .pattern(new RegExp(this.passwordRegex))
      .min(8)
      .max(40),
    email: joi.string().email(),
  });
}
