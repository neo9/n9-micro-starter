import debug from 'debug'
import * as socketIO from 'socket.io'

const conf: Conf = global.conf
const log = global.log.module('io')

export default (server) => {
	// If IO server not enable, stop here
	if (!conf.io || !conf.io.enabled) {
		return
	}
	// Create socket server
	log.info('Creating socket server')
	const io = socketIO(server)

	io.on('connection', (socket) => {
		log.info(`User connected. Socket id ${socket.id}`)

		socket.on('disconnect', () => {
			log.info(`User disconnected. Socket id ${socket.id}`)
		})
	})

	return io
}
