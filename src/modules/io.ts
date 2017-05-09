import debug from 'debug'
import * as socketIO from 'socket.io'

const { name } = global.conf
const log = debug(`${name}:io`)

export default (server) => {
	// Create socket server
	log('Creating socket server')
	const io = socketIO(server)

	io.on('connection', (socket) => {
		log(`User connected. Socket id ${socket.id}`)

		socket.on('disconnect', () => {
			log(`User disconnected. Socket id ${socket.id}`)
		})
	})

	return io
}
