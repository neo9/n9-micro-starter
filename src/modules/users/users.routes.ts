import * as validation from './users.validation'
import { createUser } from './users.controller'

export default [
	{
		method: 'post',
		path: '/users',
		validate: validation.createUser,
		handler: [ createUser ]
	}
]
