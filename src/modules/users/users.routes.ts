import * as validation from './users.validation'
import { createUser, getUserById } from './users.controller'

const userExample = {
	_id: '591427845bb9a818da5b3246',
	firstName: 'Bruce',
	lastName: 'Wayne',
	email: 'bruce@neo9.fr',
	createdAt: new Date().toJSON()
}

export default [
	{
		method: 'post',
		path: '/users',
		validate: validation.createUser,
		handler: createUser,
		documentation: {
			description: 'Sign-up a new user',
			response: userExample
		}
	},
	{
		method: 'get',
		path: '/users/:id',
		validate: validation.getUserById,
		handler: getUserById,
		documentation: {
			description: 'Get a user by its ID',
			response: userExample
		}
	}
]
