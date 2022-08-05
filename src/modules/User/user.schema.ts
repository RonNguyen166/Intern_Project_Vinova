import Joi, { ObjectSchema } from "joi";
import { objectId } from "../../common/validation/custom.vaidation";
import { Roles } from "../../utils/constants";

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

const create = Joi.object({
  body: Joi.object().keys({
    fullName: Joi.string().required(),
    alias: Joi.string().required(),
    team: Joi.string().required(),
    gender: Joi.boolean().required(),
    dob: Joi.date().required(),
    country: Joi.string().required(),
    email: Joi.string().required().email(),
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
