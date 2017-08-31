import { N9Error } from '@neo9/n9-node-utils'
import * as Sessions from './sessions.service'

// Users module dependency
import * as Users from '../users/users.service'
import { verifyPassword } from '../users/users.utils'

export async function createSession(req, res) {
	const email = req.body.email.toLowerCase()
	const password = req.body.password

	const user = await Users.getByEmail(email)
	if (!user) {
		throw new N9Error('invalid-credentials', 401)
	}
	// Check if password matches
	const match = await verifyPassword(user.password, password)
	if (!match) {
		throw new N9Error('invalid-credentials', 401)
	}
	// Update user lastSessionDate
	await Users.updatebyId(user._id, { lastSessionAt: new Date() })
	// Create user session
	const session: any = Sessions.create(user)
	session.accessToken = await req.generateJWT(session)
	// Send back session
	res.json(session)
}

export async function getSession(req, res) {
	// We always send back a fresh & valid session
	const session: any = Sessions.create(req.session)
	session.accessToken = await req.generateJWT(session)
	res.json(session)
}
