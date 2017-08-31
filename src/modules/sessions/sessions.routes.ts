import * as validation from './sessions.validation'
import { createSession, getSession } from './sessions.controller'

export default [
	{
		method: 'post',
		path: '/session',
		validate: validation.createSession,
		handler: createSession
	},
	{
		method: 'get',
		path: '/session',
		session: true, // We tell n9-micro to verify that a JWT is given
		handler: getSession
	}
]
