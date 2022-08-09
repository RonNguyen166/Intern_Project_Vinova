import Joi, { ObjectSchema } from "joi";

const create = Joi.object({
  body: Joi.object().keys({
    name: Joi.string().required()
  }),
});
const getAll = Joi.object({
  query: Joi.object().keys({
    name: Joi.string()

  }),
});

const getOne: ObjectSchema = Joi.object({
  params: Joi.object().keys({
    name: Joi.string()
  }),
});

const updateOne: ObjectSchema = Joi.object({
  params: Joi.object().keys({
    id: Joi.string().required(),
  }),
  body: Joi.object().keys({
    body: Joi.object().keys({
      name: Joi.string()
      }),
    }),
  });

const deleteOne: ObjectSchema = Joi.object({
  params: Joi.object().keys({
    id: Joi.string(),
  }),
});
export { create, deleteOne, updateOne, getAll, getOne };
