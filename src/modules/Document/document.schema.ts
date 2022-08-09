import Joi, { ObjectSchema } from "joi";

const create = Joi.object({
  body: Joi.object().keys({
    image: Joi.any().required(),
    title: Joi.string().required(),
    link: Joi.any().required()
  }),
});
const getAll = Joi.object({
  query: Joi.object().keys({
    image: Joi.any(),
    title: Joi.string(),
    link: Joi.any()
  }),
});

const getOne: ObjectSchema = Joi.object({
  params: Joi.object().keys({
    id: Joi.string(),
  }),
});

const updateOne: ObjectSchema = Joi.object({
  params: Joi.object().keys({
    id: Joi.string().required(),
  }),
  body: Joi.object().keys({
    body: Joi.object().keys({
      image: Joi.any(),
      title: Joi.string(),
      link: Joi.any()
      }),
    }),
  });

const deleteOne: ObjectSchema = Joi.object({
  params: Joi.object().keys({
    id: Joi.string(),
  }),
});
export { create, deleteOne, updateOne, getAll, getOne };
