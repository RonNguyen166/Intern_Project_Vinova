import Joi, {ObjectSchema} from "joi";

function bodyCheck(value: string, helpers: any){
    if(!value.startsWith("+")) {
        return helpers.message("A transaction must start with a +");
    }
    return value;
}

const create = Joi.object({
    body: Joi.object().keys({
        post: Joi.string().required().custom(bodyCheck),
    })
})

export {
    create
};