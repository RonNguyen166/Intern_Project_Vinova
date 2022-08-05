import Joi from "joi";

const tagRegex = /#[a-zA-Z0-9_-]+/;
const create = Joi.object({
    body: Joi.object().keys({
        name: Joi.string().required().pattern(new RegExp(tagRegex))
    })
    
})

export{create};