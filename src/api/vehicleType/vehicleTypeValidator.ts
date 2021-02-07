import Joi from "@hapi/joi";

export const VehicleTypesValidationSchema = Joi.object().keys({
   
    seatNumber: Joi.number().required(),
    featureId:Joi.string().uuid().required()
});