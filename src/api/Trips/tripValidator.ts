import  Joi from  '@hapi/joi'


export const TripValidationSchema = Joi.object().keys({
    routeId:Joi.string().uuid().required(),
       schedule:Joi.string().required(),
       typeId:Joi.string().uuid().required(),
    day:Joi.array().required(),
    price:Joi.number().required()




})
export const TripUpdateSchema = Joi.object().keys({
    price:Joi.string().optional(),
    schedule:Joi.string().optional()

})
export const TripSearch = Joi.object().keys({
    routeId:Joi.string().uuid().required(),
    travelDate:Joi.string().required(),
})
