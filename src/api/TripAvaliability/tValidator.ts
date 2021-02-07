import Joi from '@hapi/joi'

export const TripAvaliabilitySchema =Joi.object().keys({
    departureTime:Joi.string().required(),
    tripId:Joi.string().uuid().required(),
    routeId:Joi.string().uuid().required(),
   

})