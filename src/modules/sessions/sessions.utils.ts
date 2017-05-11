import * as jwt from 'jsonwebtoken'

const conf = global.conf

export function getFromHeaderOrQuery(req) {
	// If authorization in headers
	if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
		return req.headers.authorization.split(' ')[1]
	}
	// Otherwise, if given from query params (email link for example)
	if (req.query && req.query.token) {
		return req.query.token
	}
	return null
}

export function generateAccessToken(session) {
	return jwt.sign(session, conf.jwt.secret, { expiresIn: conf.jwt.expiresIn })
}
