import { createServer } from 'http'

import debug from 'debug'
import * as express from 'express'
import * as morganDebug from 'morgan-debug'
import * as helmet from 'helmet'
import * as bodyParser from 'body-parser'

const conf = global.conf
const log = global.log.module('http')

// Export express app & http server
export const app = express()
export const server = createServer(app)
export const listen = () => {
	return new Promise((resolve) => {
		server.listen(conf.http.port)
		server.on('error', (error) => {
			onError(error)
			resolve()
		})
		server.on('listening', () => {
			onListening()
			resolve()
		})
	})
}

// Middleware
app.use(helmet())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Logger middleware
app.use(morganDebug(`${conf.name}:router`, conf.log.level))

/*
** Event listener for HTTP server "error" event.
*/
function onError(error) {
	if (error.syscall !== 'listen') {
		throw error
	}

	// handle specific listen errors with friendly messages
	switch (error.code) {
		case 'EACCES':
			log.info(`Port ${conf.http.port} requires elevated privileges`)
			process.exit(1)
			break
		case 'EADDRINUSE':
			log.info(`Port ${conf.http.port} is already in use`)
			process.exit(1)
			break
		default:
			throw error
	}
}

/*
** Event listener for HTTP server "listening" event.
*/
function onListening() {
	const addr = server.address()
	log.info('Listening on port ' + addr.port)
}
