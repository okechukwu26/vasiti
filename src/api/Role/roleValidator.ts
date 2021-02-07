import Joi from '@hapi/joi';

export const RoleValidationSchema = Joi.object().keys({
  role: Joi.string().lowercase().valid('captain',"maintenance", 'customer', 'manager', 'ticket', 'admin').required(),
});
