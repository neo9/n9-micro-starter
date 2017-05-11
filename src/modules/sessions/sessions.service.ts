import * as jwt from 'jsonwebtoken'
import * as expressJWT from 'express-jwt'

import { ExtendableError } from '../utils'
import { getFromHeaderOrQuery, generateAccessToken } from './sessions.utils'

// Users module dependency
import * as Users from '../users/users.service'

export async function create(user) {
	const session = {
		userId: user._id,
		email: user.email,
		firstName: user.firstName,
		lastName: user.lastName
	}
	return {
		accessToken: generateAccessToken(session),
		...session
	}
}

export async function refresh(session) {
	// Check if userId exists
	const user = await Users.getById(session.userId)
	if (!user) {
		throw new ExtendableError('user-not-connected', 401)
	}
	return await create(user)
}
