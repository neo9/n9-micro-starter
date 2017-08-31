import * as validation from './users.validation'
import { createUser, getUserById } from './users.controller'

export default [
	{
		method: 'post',
		path: '/users',
		validate: validation.createUser,
		handler: createUser
	},
	{
		method: 'get',
		path: '/users/:id',
		session: true,
		validate: validation.getUserById,
		handler: getUserById
	}
]
