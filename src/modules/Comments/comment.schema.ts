import Joi, { ObjectSchema } from "joi";
// import { Roles } from "../../utils/constants";

const create = Joi.object({
  body: Joi.object().keys({
    content: Joi.string().required(),
    user_id: Joi.string().required(),
    parent_id: Joi.string(),
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
    content: Joi.string().required(),
    user_id: Joi.string().required(),
    parent_id: Joi.string(),
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
export { create,  getAll, getOne, updateOne , deleteOne};
