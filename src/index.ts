// Add source map supports
import 'source-map-support/register'

// Dependencies
import { join } from 'path'
import * as glob from 'glob-promise'

// Load project conf & set as global
import conf from './modules/conf'
global.conf = conf

// Load logging system
import N9Log from './modules/log'
global.log = new N9Log(conf.name)

log.profile('startup')

// Provides a stack trace for unhandled rejections instead of the default message string.
process.on('unhandledRejection', (err) => {
	throw err
})

// Load modules
import './modules/newrelic'
import { app, server, listen } from './modules/http'
import { connect } from './modules/mongo'
import IOServer from './modules/io'
import routes from './modules/routes'

// Start
(async () => {
	// IO Server
	const io = IOServer(server)
	// Connect to MongoDB
	await connect()
	// Init modules
	const initFiles = await glob('**/*.init.+(ts|js)', { cwd: __dirname })
	await Promise.all(initFiles.map((file) => require(join(__dirname, file)).default()))
	// Add routes
	await routes(app)
	// Start the server
	await listen()
	// Log the startup time
	log.profile('startup')
})()
