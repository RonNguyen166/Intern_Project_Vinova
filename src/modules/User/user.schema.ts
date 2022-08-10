import Joi, { ObjectSchema } from "joi";
import {
  objectId,
  capitalize,
  password,
} from "../../common/validation/custom.vaidation";
import { Roles } from "../../utils/constants";

const create = Joi.object({
  body: Joi.object().keys({
    fullName: Joi.string().required().trim(),
    alias: Joi.string().required().trim().custom(capitalize),
    team: Joi.string().required(),
    gender: Joi.boolean().required(),
    dob: Joi.date().required(),
    country: Joi.string().required(),
    email: Joi.string().required().trim().email(),
    point: Joi.object().keys({
      givePoint: Joi.number().required(),
      redeemPoint: Joi.number().required(),
    }),
    photo: Joi.any(),
    password: Joi.string().required().min(6).max(40).custom(password),
    passwordConfirm: Joi.any()
      .equal(Joi.ref("password"))
      .required()
      .label("Confirm password")
      .messages({ "any.only": "{{#label}} does not match" }),
    isEmailVerified: Joi.boolean().required(),
    role: Joi.string().valid(Roles),
  }),
});
const getAll = Joi.object({
  query: Joi.object().keys({
    page: Joi.string(),
    size: Joi.string(),
    email: Joi.string(),
    alias: Joi.string(),
    search: Joi.string(),
    sortBy: Joi.string(),
    orderBy: Joi.string(),
  }),
});

const getOne: ObjectSchema = Joi.object({
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
});

const updateOne: ObjectSchema = Joi.object({
  params: Joi.object().keys({
    id: Joi.required().custom(objectId),
  }),
  body: Joi.object().keys({
    fullName: Joi.string(),
    alias: Joi.string(),
    team: Joi.string(),
    gender: Joi.boolean(),
    dob: Joi.date(),
    country: Joi.string(),
    photo: Joi.any(),
    email: Joi.string().email(),
    point: Joi.object().keys({
      givePoint: Joi.number(),
      reddemPoint: Joi.number(),
    }),
    password: Joi.string().min(6).max(40).custom(password),
    passwordConfirm: Joi.any()
      .equal(Joi.ref("password"))
      .label("Confirm password")
      .messages({ "any.only": "{{#label}} does not match" }),
    role: Joi.string().valid(Roles),
  }),
});
const deleteOne: ObjectSchema = Joi.object({
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
});

// const editProfile: ObjectSchema = Joi.object({
//   body: Joi.object().keys({
//     fullName: Joi.string(),
//     subName: Joi.string(),
//     alias: Joi.string(),
//     gender: Joi.boolean(),
//     dob: Joi.date(),
//     country: Joi.string(),
//     photo: Joi.any(),
//     email: Joi.string().email(),
//     password: Joi.string().min(6).max(40).custom(password),
//     passwordConfirm: Joi.any()
//       .equal(Joi.ref("password"))
//       .label("Confirm password")
//       .messages({ "any.only": "{{#label}} does not match" })
//   }),
// });
const editProfile: ObjectSchema = Joi.object({
  body: Joi.object().keys({
    fullName: Joi.string(),
    subName: Joi.string(),
    password: Joi.string().min(6).max(40).custom(password),
    passwordConfirm: Joi.any()
      .equal(Joi.ref("password"))
      .label("Confirm password")
      .messages({ "any.only": "{{#label}} does not match" }),
    photo: Joi.any(),
  }),
});
export { create, deleteOne, updateOne, getAll, getOne, editProfile };
