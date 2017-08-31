import test from 'ava'

// NPM modules
import * as stdMocks from 'std-mocks'
import { cb, waitFor, waitForEvent } from '@neo9/n9-node-utils'
import { Db, Collection, ObjectID } from 'mongodb'

/*
** Helpers
*/
import { context, get, post, put, del } from './fixtures/helpers'

/*
** Start API
*/
test.before('Start server', async (t) => {
	stdMocks.use()
	// Set env to 'test'
	process.env.NODE_ENV = 'test'
	// Require server
	const { server, db, conf } = await require('../src').default
	// Drop collections
	await db.dropDatabase()
	// Re-create indexes
	await db.collection('users').createIndex({ email: 1, username: 1 }, { unique: true })
	// Add variables to context
	context.server = server
	context.db = db
	context.conf = conf
	// Flush logs output
	stdMocks.flush()
	stdMocks.restore()
})

/*
** Informations routes
*/
test.serial('GET / => n9-micro-starter', async (t) => {
	const { statusCode, body, stdout, stderr } = await get('/')
	t.is(statusCode, 200)
	t.is(body, 'n9-micro-starter')
	t.is(stderr.length, 0)
	t.is(stdout.length, 1)
	t.true(stdout[0].includes('GET /'))
})

test.serial('GET /ping => pong', async (t) => {
	const { statusCode, body, stdout, stderr } = await get('/ping')
	t.is(statusCode, 200)
	t.is(body, 'pong')
	t.is(stderr.length, 0)
	t.is(stdout.length, 1)
	t.true(stdout[0].includes('GET /ping'))
})

test.serial('GET /routes => 4 routes', async (t) => {
	const { statusCode, body } = await get('/routes')
	t.is(statusCode, 200)
	t.is(body.length, 4)
})

test.serial('GET /404 => 404 status code', async (t) => {
	const { statusCode, body } = await get('/404')
	t.is(statusCode, 404)
	t.is(body.code, 'not-found')
	t.is(body.context.url, '/404')
})

/*
** modules/users/
*/
test.serial('POST /users => 200 with good params', async (t) => {
	const { statusCode, body } = await post('/users', {
		body: {
			firstname: 'Neo',
			lastname: 'FIT',
			email: 'neofit@neo9.fr',
			password: 'thenx4ever'
		}
	})
	t.is(statusCode, 200)
	t.is(body.firstname, 'Neo')
	t.is(body.lastname, 'FIT')
	t.is(body.email, 'neofit@neo9.fr')
	t.falsy(body.password)
	// Add to context
	context.user = body
})

test.serial('POST /users => 409 with user already exists', async (t) => {
	const { statusCode, body } = await post('/users', {
		body: {
			firstname: 'Neo',
			lastname: 'FIT',
			email: 'neofit@neo9.fr',
			password: 'thenx4ever'
		}
	})
	t.is(statusCode, 409)
	t.is(body.code, 'user-already-exists')
})

test.serial('GET /users/:id => 401 when not connected', async (t) => {
	const { statusCode, body } = await get('/users/012345678901234567890123')
	t.is(statusCode, 401)
	t.is(body.code, 'credentials-required')
})


/*
** modules/sessions/
*/
test.serial('POST /session => 400 with bad email', async (t) => {
	const { statusCode, body, stdout } = await post('/session', {
		body: { email: 'bad' }
	})
	t.is(statusCode, 400)
	t.is(body.code, 'validation error')
})

test.serial('POST /session => 401 with unkown email', async (t) => {
	const { statusCode, body, stdout } = await post('/session', {
		body: {
			email: 'unkown@neo9.fr',
			password: 'unkownPassword'
		}
	})
	t.is(statusCode, 401)
	t.is(body.code, 'invalid-credentials')
})

test.serial('POST /session => 401 with bad password', async (t) => {
	const { statusCode, body, stdout } = await post('/session', {
		body: {
			email: context.user.email,
			password: 'thenxNEVER'
		}
	})
	t.is(statusCode, 401)
	t.is(body.code, 'invalid-credentials')
})

test.serial('POST /session => 200 with good params', async (t) => {
	const { statusCode, body, stdout } = await post('/session', {
		body: {
			email: context.user.email,
			password: 'thenx4ever'
		}
	})
	t.is(statusCode, 200)
	t.is(body.userId, context.user._id)
	t.is(body.email, context.user.email)
	t.truthy(body.accessToken)
	// Add session to context
	context.session = body
})

test.serial('GET /session => 401 when not connected', async (t) => {
	const { statusCode, body } = await get('/session')
	t.is(statusCode, 401)
	t.is(body.code, 'credentials-required')
})

test.serial('GET /session => 401 with bad JWT token', async (t) => {
	const headers = { Authorization: `Bearer bad` }
	const { statusCode, body } = await get('/session', { headers })
	t.is(statusCode, 401)
	t.is(body.code, 'invalid-token')
})

test.serial('GET /session => 200 with good JWT token + new accessToken', async (t) => {
	const headers = { Authorization: `Bearer ${context.session.accessToken}` }
	const { statusCode, body } = await get('/session', { headers })
	t.is(statusCode, 200)
	t.truthy(body.accessToken)
	// Update context.session
	context.session = body
})

/*
** modules/users/
*/
test.serial('GET /users/:id => 404 with user not found', async (t) => {
	const headers = { Authorization: `Bearer ${context.session.accessToken}` }
	const { statusCode, body } = await get('/users/012345678901234567890123', { headers })
	t.is(statusCode, 404)
	t.is(body.code, 'user-not-found')
})

test.serial('GET /users/:id => 200 with user found', async (t) => {
	const headers = { Authorization: `Bearer ${context.session.accessToken}` }
	const { statusCode, body } = await get(`/users/${context.session.userId}`, { headers })
	t.is(statusCode, 200)
	t.is(body.email, context.session.email)
})

/*
** Stop API
*/
test.after('Stop server', async (t) => {
	await cb(context.server.close.bind(context.server))
})
