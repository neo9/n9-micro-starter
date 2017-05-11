import { ExtendableError } from '../utils'
import * as Sessions from './sessions.service'

// Users module dependency
import * as Users from '../users/users.service'
import { verifyPassword } from '../users/users.utils'

export async function createSession(req, res, next) {
	const email = req.body.email.toLowerCase()
	const password = req.body.password

	const user = await Users.getByEmail(email)
	if (!user) {
		return next(new ExtendableError('invalid-credentials', 401))
	}
	// Check if password matches
	const match = await verifyPassword(user.password, password)
	if (!match) {
		return next(new ExtendableError('invalid-credentials', 401))
	}
	// Update user lastSessionDate
	await Users.updatebyId(user._id, { lastSessionAt: new Date() })
	// Create user session
	const session = await Sessions.create(user)
	// Send back session
	res.json(session)
}

export async function getSession(req, res, next) {
	// We always send back a fresh & valid session
	const session = await Sessions.refresh(req.session)
	res.json(session)
}
