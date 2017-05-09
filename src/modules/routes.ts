import debug from 'debug'
import { Router } from 'express'
import * as validate from 'express-validation'

import { ExtendableError } from './utils'

const { name } = global.conf
const log = debug(`${name}:router`)

const modules = [
	// Add modules here
	'users'
]

let routes = []

export default (app) => {

	log('Adding application routes')

	app.get('/', (req, res) => {
		res.status(200).send(name)
	})

	app.get('/ping', (req, res) => {
		res.status(200).send('pong')
	})

	app.get('/routes', (req, res) => {
		res.status(200).send(routes)
	})

	modules.forEach((module) => {
		const moduleRouter = Router()
		const moduleRoutes = require(`./${module}/${module}.routes`).default
		// Create route handle for the exported routes
		moduleRoutes.forEach((r) => {
			// Add validation middleware validate schema defined
			if (r.validate) {
				if (!Array.isArray(r.handler)) r.handler = [ r.handler ]
				r.handler.unshift(validate(r.validate))
			}
			// Add route in express app, see http://expressjs.com/fr/4x/api.html#router.route
			moduleRouter.route(r.path)[r.method](r.handler)
		})
		app.use(moduleRouter)
		// Add routes definitions to /routes
		routes = routes.concat(moduleRoutes.map((r) => {
			return {
				acl: r.acl || [],
				method: r.method,
				path: r.path
			}
		}))
	})

	app.use((req, res, next) => {
		return next(new ExtendableError('not-found', 404))
	})

	// Development error handler
	// Will print stacktrace
	if (app.get('env') === 'development') {
		app.use((err, req, res, next) => {
			log(err)
			res.status(err.status || 500)
			res.json({
				code: err.message,
				error: err
			})
		})
	}

	// Production error handler
	// No stacktraces leaked to user
	app.use((err, req, res, next) => {
		res.status(err.status || 500)
		res.json({
			code: err.message,
			error: {}
		})
	})

}
