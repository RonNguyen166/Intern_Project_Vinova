import Joi from "joi";
import { objectId } from "../../common/validation/custom.vaidation";

const create = Joi.object({
  body: Joi.object().keys({
    title: Joi.string().required(),
    tags: Joi.string(),
    content: Joi.string().required(),
    category: Joi.string().custom(objectId),
  }),
});

const getFilter = Joi.object({
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

const getComments = Joi.object({
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
  query: Joi.object().keys({
    limit: Joi.number(),
  }),
});

const updateOne = Joi.object({
  params: Joi.object().keys({
    id: Joi.required().custom(objectId),
  }),
  body: Joi.object().keys({
    title: Joi.string(),
    tags: Joi.string(),
    content: Joi.string(),
    category: Joi.string().custom(objectId),
  }),
});

const paramId = Joi.object({
  params: Joi.object().keys({
    id: Joi.required().custom(objectId),
  }),
});

export { create, updateOne, getFilter, getComments, paramId };
