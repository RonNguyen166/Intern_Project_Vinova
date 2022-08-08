import Joi, { ObjectSchema } from "joi";
import { objectId } from "../../common/validation/custom.vaidation";

const create = Joi.object({
  body: Joi.object().keys({
    post_id: Joi.required().custom(objectId),
    content: Joi.string().required(),
  }),
});
const getAll = Joi.object({
  query: Joi.object().keys({
    content: Joi.string().required(),
    user_id: Joi.string().required(),
    parent_id: Joi.string(),
  }),
});

const getOne: ObjectSchema = Joi.object({
  params: Joi.object().keys({
    postId: Joi.required().custom(objectId),
    commentId: Joi.required().custom(objectId),
  }),
});

const updateOne: ObjectSchema = Joi.object({
  params: Joi.object().keys({
    id: Joi.string().required(),
  }),
  body: Joi.object().keys({
    body: Joi.object().keys({
      content: Joi.string().required(),
      user_id: Joi.string().required(),
      parent_id: Joi.string(),
    }),
  }),
});

const deleteOne: ObjectSchema = Joi.object({
  params: Joi.object().keys({
    id: Joi.string(),
  }),
});

export { create, getAll, getOne, updateOne, deleteOne };
