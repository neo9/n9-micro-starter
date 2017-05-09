import { ExtendableError } from '../utils'
import * as Users from './users.service'

export async function createUser(req, res, next) {
	const userBody = req.body

	// sanitize email to lowercase
	userBody.email = userBody.email.toLowerCase()
	// Check if user by email already exists
	const userExists = await Users.findOne({ email: userBody.email })
	if (userExists) {
		return next(new ExtendableError('user-already-exists', 409))
	}
	// Add user to database
	const user = await Users.create(userBody)
	// Send back the user created
	res.json(user)
}
