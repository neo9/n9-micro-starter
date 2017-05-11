import { join } from 'path'

import { Router } from 'express'
import * as validate from 'express-validation'
import * as joiToJson from 'joi-to-json-schema'
import * as glob from 'glob-promise'

import { ExtendableError } from './utils'

const { name } = global.conf
const log = global.log.module('router')

let routes = []

export default async (app) => {

	log.info('Adding application routes')

	// Send back its name for discovery
	app.get('/', (req, res) => {
		res.status(200).send(name)
	})

	// Monitoring route
	app.get('/ping', (req, res) => {
		res.status(200).send('pong')
	})

	// List all routes
	app.get('/routes', (req, res) => {
		res.status(200).send(routes)
	})

	// Find every module which export .routes.ts file
	const routeFiles = await glob('**/*.routes.+(ts|js)', { cwd: __dirname })
	// Add routes for every module
	routeFiles.forEach((routeFile) => {
		// Create Express Router
		const moduleRouter = Router()
		// Fetch exported routes by the module
		const moduleRoutes = require(join(__dirname, routeFile)).default
		// Create route handle for the exported routes
		moduleRoutes.forEach((r) => {
			// Make sure r.handler is an array
			if (!Array.isArray(r.handler)) r.handler = [ r.handler ]
			// Handle versionning
			r.handler.unshift(versionning(r.version))
			// Add validation middleware validate schema defined
			if (r.validate) {
				r.handler.unshift(validate(r.validate))
			}
			// Add route in express app, see http://expressjs.com/fr/4x/api.html#router.route
			moduleRouter.route(`/:version?${r.path}`)[r.method](r.handler)
		})
		app.use(moduleRouter)
		// Add routes definitions to /routes
		routes = routes.concat(...moduleRoutes.map((r) => {
			// Force version to be an array
			let versions = r.version
			if (!Array.isArray(versions)) {
				versions = [ versions || '*' ]
			}
			// Force documentation key to be defined
			r.documentation = r.documentation || {}
			// Return a route definition for each version
			return versions.map((version) => {
				return {
					module: routeFile.split('/')[0],
					name: (r.name || r.handler[r.handler.length - 1].name),
					description: r.documentation.description || '',
					version,
					method: r.method,
					path: (version !== '*' ? `/${version}${r.path}` : r.path),
					auth: r.auth || false,
					acl: r.acl || [],
					validate: {
						headers: r.validate && r.validate.headers ? joiToJson(r.validate.headers) : undefined,
						params: r.validate && r.validate.params ? joiToJson(r.validate.params) : undefined,
						query: r.validate && r.validate.query ? joiToJson(r.validate.query) : undefined,
						body: r.validate && r.validate.body ? joiToJson(r.validate.body) : undefined
					},
					response: r.documentation.response
				}
			})
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

function versionning(version) {
	return (req, res, next) => {
		// If no version defined for the route, ignore actual version
		if (!version) {
			return next()
		}
		// Force version to be an array
		if (!Array.isArray(version)) {
			version = [ version ]
		}
		// Check if param version is matching the route version(s)
		if (version.includes(req.params.version)) {
			return next()
		}
		next(new ExtendableError('version-not-supported', 400, { version }))
	}
}
