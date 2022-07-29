import Joi from "joi";

function password(value: string, helpers: any) {
  if (value.length < 6) {
    return helpers.message("password must be at least 6 characters");
  }
  if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
    return helpers.message(
      "password must contain at least 1 letter or 1 number"
    );
  }
  return value;
}

const register = Joi.object({
  body: Joi.object().keys({
    fullName: Joi.string().required(),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6).max(40).custom(password),
    passwordConfirm: Joi.any()
      .equal(Joi.ref("password"))
      .required()
      .label("Confirm password")
      .messages({ "any.only": "{{#label}} does not match" }),
  }),
});

const login = Joi.object({
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
});

const forgotPassword = Joi.object({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
});

const resetPassword = Joi.object({
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
  body: Joi.object().keys({
    password: Joi.string().required().custom(password),
    passwordConfirm: Joi.any()
      .equal(Joi.ref("password"))
      .required()
      .label("Confirm password")
      .messages({ "any.only": "{{#label}} does not match" }),
  }),
});
const verifyEmail = Joi.object({
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
});

export { register, login, forgotPassword, resetPassword, verifyEmail };
