import Joi from "@hapi/joi";

export const vehiclesFeaturesValidationSchema = Joi.object().keys({
    attribute: Joi.string().lowercase().required(),
});