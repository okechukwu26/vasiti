import Joi from "@hapi/joi";


export const terminalValidationSchema = Joi.object().keys({
    name: Joi.string().lowercase().required(),
    stateId:Joi.string().required(),
    lgaId:Joi.string().required()
   
});