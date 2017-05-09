// Add source map supports
import 'source-map-support/register'

// NPM modules
import * as a from 'awaiting'

// Load project conf & set as global
import config from './modules/conf'
global.conf = config

// Provides a stack trace for unhandled rejections instead of the default message string.
// See https://hunterloftis.github.io/awaiting/#throw
a.throw()

// Load modules
import './modules/newrelic'
import { app, server, listen } from './modules/http'
import { connect } from './modules/mongo'
import IOServer from './modules/io'
import routes from './modules/routes'

// Start modules

// Init modules
(async () => {
	// IO Server
	const io = IOServer(server)
	// Connect to MongoDB
	await connect()
	// Add routes
	routes(app)
	// Start the server
	listen()
})()
