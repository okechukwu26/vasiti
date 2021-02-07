import Joi from "@hapi/joi";

export const lgaValidationSchema = Joi.object().keys({
    name: Joi.string().lowercase().required(),
    stateId:Joi.string().required()
   
});