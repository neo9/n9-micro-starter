import * as validation from './sessions.validation'
import { createSession, getSession } from './sessions.controller'

const sessionExampleResponse = {
	accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiO\
	iI1OTExOTExMDc2Njg2ZjUwYjFmMmQ1MDciLCJlbWFpbCI6ImF0aW51eEBnbWFpbC\
	5jb20iLCJmaXJzdE5hbWUiOiJTZWJhc3RpZW4iLCJsYXN0TmFtZSI6IkNob3BpbiIs\
	ImlhdCI6MTQ5NDQxMjU3MiwiZXhwIjoxNDk3MDA0NTcyfQ.YBElKO2Kup7JwVjUXzyD\
	6Gnm-_7ufhq2FPVHpimsMgQ',
	userId: '5911911076686f50b1f2d507',
	email: 'bruce@neo9.fr',
	firstName: 'Bruce',
	lastName: 'Wayne'
}

export default [
	{
		method: 'post',
		path: '/sessions',
		validate: validation.createSession,
		handler: createSession,
		documentation: {
			description: 'Create a new session by sign-in the user.',
			response: sessionExampleResponse
		}
	},
	{
		method: 'get',
		path: '/session',
		auth: true,
		handler: getSession,
		documentation: {
			description: 'Get the user session for an Authorization token',
			response: sessionExampleResponse
		}
	}
]
