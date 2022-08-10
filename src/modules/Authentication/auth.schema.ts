import Joi from "joi";
import { capitalize, password } from "../../common/validation/custom.vaidation";

const register = Joi.object({
  body: Joi.object().keys({
    fullName: Joi.string().required(),
    alias: Joi.string().required().trim().custom(capitalize),
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

const updatePassword = Joi.object({
  body: Joi.object().keys({
    passwordCurrent: Joi.string().required(),
    password: Joi.string().required().custom(password),
    passwordConfirm: Joi.any()
      .equal(Joi.ref("password"))
      .required()
      .label("Confirm password")
      .messages({ "any.only": "{{#label}} does not match" }),
  }),
});

export {
  register,
  login,
  forgotPassword,
  resetPassword,
  verifyEmail,
  updatePassword,
};
