import * as Joi from 'joi'

export const createSession = {
	body: Joi.object().keys({
		email: Joi.string().email().required(),
		password: Joi.string().min(8).required()
	})
}
