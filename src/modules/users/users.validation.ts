import * as Joi from 'joi'

export const createUser = {
	body: Joi.object().keys({
		firstName: Joi.string().min(2).required(),
		lastName: Joi.string().min(2).required(),
		email: Joi.string().email().required(),
		password: Joi.string().min(8).required()
	})
}

export const getUserById = {
	params: Joi.object().keys({
		id: Joi.string().length(24).alphanum()
	})
}
