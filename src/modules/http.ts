import { createServer } from 'http'

import debug from 'debug'
import * as express from 'express'
import * as morganDebug from 'morgan-debug'
import * as bodyParser from 'body-parser'

const conf = global.conf
const log = debug(`${conf.name}:http`)

// Export express app & http server
export const app = express()
export const server = createServer(app)
export const listen = () => {
	server.listen(conf.http.port)
	server.on('error', onError)
	server.on('listening', onListening)
}

// Middleware
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
			log(`Port ${conf.http.port} requires elevated privileges`)
			process.exit(1)
			break
		case 'EADDRINUSE':
			log(`Port ${conf.http.port} is already in use`)
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
	log('Listening on port ' + addr.port)
}
