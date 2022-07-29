import Joi, { ObjectSchema } from "joi";
// import { Roles } from "../../utils/constants";

const create = Joi.object({
  body: Joi.object().keys({
    image: Joi.string().required(),
    title: Joi.string().required(),
    link: Joi.link().required()
  }),
});
const getAll = Joi.object({
  query: Joi.object().keys({
    image: Joi.string(),
    title: Joi.string(),
    link: Joi.link()
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
      image: Joi.string(),
      title: Joi.string(),
      link: Joi.link()
      }),
    }),
  });

const deleteOne: ObjectSchema = Joi.object({
  params: Joi.object().keys({
    id: Joi.string(),
  }),
});
export { create, deleteOne, updateOne, getAll, getOne };
