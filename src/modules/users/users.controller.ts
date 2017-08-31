import { omit } from 'lodash'
import { N9Error } from '@neo9/n9-node-utils'

import * as Users from './users.service'

export async function createUser(req, res) {
	const userBody = req.body

	// sanitize email to lowercase
	userBody.email = userBody.email.toLowerCase()
	// Check if user by email already exists
	const userExists = await Users.getByEmail(userBody.email)
	if (userExists) {
		throw new N9Error('user-already-exists', 409)
	}
	// Add user to database
	const user = await Users.create(userBody)
	// Send back the user created
	res.json(omit(user, 'password'))
}

export async function getUserById(req, res) {
	const userId = req.params.id

	// Check if user exists
	const user = await Users.getById(userId)
	if (!user) {
		throw new N9Error('user-not-found', 404)
	}
	// Send back the user
	res.json(omit(user, 'password'))
}
